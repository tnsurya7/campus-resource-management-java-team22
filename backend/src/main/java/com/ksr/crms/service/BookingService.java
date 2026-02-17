package com.ksr.crms.service;

import com.ksr.crms.dto.BookingDTO;
import com.ksr.crms.entity.Booking;
import com.ksr.crms.entity.Resource;
import com.ksr.crms.entity.User;
import com.ksr.crms.exception.ConflictException;
import com.ksr.crms.exception.ResourceNotFoundException;
import com.ksr.crms.exception.UnauthorizedException;
import com.ksr.crms.exception.ValidationException;
import com.ksr.crms.repository.BookingRepository;
import com.ksr.crms.repository.ResourceRepository;
import com.ksr.crms.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, ResourceRepository resourceRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
    }

    @Transactional
    public BookingDTO createBooking(BookingDTO bookingDTO) {
        User user = userRepository.findById(bookingDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + bookingDTO.getUserId()));

        Resource resource = resourceRepository.findById(bookingDTO.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + bookingDTO.getResourceId()));

        // Check if user is ACTIVE
        if (user.getStatus() != User.Status.ACTIVE) {
            throw new UnauthorizedException("Only ACTIVE users can create bookings");
        }

        // Cannot book past date
        if (bookingDTO.getBookingDate().isBefore(LocalDate.now())) {
            throw new ValidationException("Cannot book past date");
        }

        // Calculate duration
        long hours = ChronoUnit.HOURS.between(bookingDTO.getStartTime(), bookingDTO.getEndTime());
        if (hours <= 0) {
            throw new ValidationException("End time must be after start time");
        }

        // Role-based duration validation
        validateDurationByRole(user.getRole(), (int) hours);

        // Check for conflicting bookings
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                bookingDTO.getResourceId(),
                bookingDTO.getBookingDate(),
                bookingDTO.getStartTime(),
                bookingDTO.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new ConflictException("Resource is already booked for the selected time slot");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResource(resource);
        booking.setBookingDate(bookingDTO.getBookingDate());
        booking.setStartTime(bookingDTO.getStartTime());
        booking.setEndTime(bookingDTO.getEndTime());
        booking.setDurationHours((int) hours);

        // Auto-approve for ADMIN
        if (user.getRole() == User.Role.ADMIN) {
            booking.setStatus(Booking.BookingStatus.APPROVED);
            booking.setApprovedBy(user.getId());
            booking.setApprovedAt(LocalDateTime.now());
        } else {
            booking.setStatus(Booking.BookingStatus.PENDING);
        }

        Booking savedBooking = bookingRepository.save(booking);
        return convertToDTO(savedBooking);
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return convertToDTO(booking);
    }

    public List<BookingDTO> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingDTO updateBooking(Long id, BookingDTO bookingDTO, Long requestingUserId) {
        User requestingUser = userRepository.findById(requestingUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Requesting user not found"));

        if (requestingUser.getRole() != User.Role.ADMIN) {
            throw new UnauthorizedException("Only ADMIN can edit bookings");
        }

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        Resource resource = resourceRepository.findById(bookingDTO.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + bookingDTO.getResourceId()));

        // Cannot book past date
        if (bookingDTO.getBookingDate().isBefore(LocalDate.now())) {
            throw new ValidationException("Cannot book past date");
        }

        // Calculate duration
        long hours = ChronoUnit.HOURS.between(bookingDTO.getStartTime(), bookingDTO.getEndTime());
        if (hours <= 0) {
            throw new ValidationException("End time must be after start time");
        }

        // Check for conflicting bookings (excluding current booking)
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                bookingDTO.getResourceId(),
                bookingDTO.getBookingDate(),
                bookingDTO.getStartTime(),
                bookingDTO.getEndTime()
        ).stream().filter(b -> !b.getId().equals(id)).collect(Collectors.toList());

        if (!conflicts.isEmpty()) {
            throw new ConflictException("Resource is already booked for the selected time slot");
        }

        booking.setResource(resource);
        booking.setBookingDate(bookingDTO.getBookingDate());
        booking.setStartTime(bookingDTO.getStartTime());
        booking.setEndTime(bookingDTO.getEndTime());
        booking.setDurationHours((int) hours);

        Booking updatedBooking = bookingRepository.save(booking);
        return convertToDTO(updatedBooking);
    }

    @Transactional
    public BookingDTO approveBooking(Long id, Long approverId) {
        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new ResourceNotFoundException("Approver not found"));

        if (approver.getRole() != User.Role.ADMIN) {
            throw new UnauthorizedException("Only ADMIN can approve bookings");
        }

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() == Booking.BookingStatus.APPROVED) {
            throw new ValidationException("Booking is already approved");
        }

        booking.setStatus(Booking.BookingStatus.APPROVED);
        booking.setApprovedBy(approverId);
        booking.setApprovedAt(LocalDateTime.now());
        booking.setRejectionReason(null);

        Booking approvedBooking = bookingRepository.save(booking);
        return convertToDTO(approvedBooking);
    }

    @Transactional
    public BookingDTO rejectBooking(Long id, Long rejecterId, String rejectionReason) {
        User rejecter = userRepository.findById(rejecterId)
                .orElseThrow(() -> new ResourceNotFoundException("Rejecter not found"));

        if (rejecter.getRole() != User.Role.ADMIN) {
            throw new UnauthorizedException("Only ADMIN can reject bookings");
        }

        if (rejectionReason == null || rejectionReason.trim().isEmpty()) {
            throw new ValidationException("Rejection reason is mandatory");
        }

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        booking.setStatus(Booking.BookingStatus.REJECTED);
        booking.setRejectionReason(rejectionReason);
        booking.setApprovedBy(null);
        booking.setApprovedAt(null);

        Booking rejectedBooking = bookingRepository.save(booking);
        return convertToDTO(rejectedBooking);
    }

    @Transactional
    public void deleteBooking(Long id, Long requestingUserId) {
        User requestingUser = userRepository.findById(requestingUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Requesting user not found"));

        if (requestingUser.getRole() != User.Role.ADMIN) {
            throw new UnauthorizedException("Only ADMIN can delete bookings");
        }

        if (!bookingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Booking not found with id: " + id);
        }

        bookingRepository.deleteById(id);
    }

    private void validateDurationByRole(User.Role role, int hours) {
        switch (role) {
            case STUDENT:
                if (hours > 1) {
                    throw new ValidationException("STUDENT can book maximum 1 hour");
                }
                break;
            case STAFF:
                if (hours > 5) {
                    throw new ValidationException("STAFF can book maximum 5 hours");
                }
                break;
            case ADMIN:
                if (hours > 24) {
                    throw new ValidationException("ADMIN can book maximum 24 hours");
                }
                break;
        }
    }

    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser().getId());
        dto.setUserName(booking.getUser().getName());
        dto.setResourceId(booking.getResource().getId());
        dto.setResourceName(booking.getResource().getName());
        dto.setBookingDate(booking.getBookingDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setDurationHours(booking.getDurationHours());
        dto.setStatus(booking.getStatus());
        dto.setRejectionReason(booking.getRejectionReason());
        dto.setApprovedBy(booking.getApprovedBy());
        
        if (booking.getApprovedBy() != null) {
            userRepository.findById(booking.getApprovedBy())
                    .ifPresent(approver -> dto.setApprovedByName(approver.getName()));
        }
        
        dto.setApprovedAt(booking.getApprovedAt());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}
