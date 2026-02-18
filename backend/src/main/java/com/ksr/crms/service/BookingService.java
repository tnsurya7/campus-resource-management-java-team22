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
        // Validate user exists
        User user = userRepository.findById(bookingDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + bookingDTO.getUserId()));

        // Validate resource exists
        Resource resource = resourceRepository.findById(bookingDTO.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + bookingDTO.getResourceId()));

        // Check if user is ACTIVE
        if (user.getStatus() != User.Status.ACTIVE) {
            throw new UnauthorizedException("Only ACTIVE users can create bookings");
        }

        // Check if resource is AVAILABLE
        if (resource.getStatus() != Resource.Status.AVAILABLE) {
            throw new ValidationException("Resource is not available for booking");
        }

        // Cannot book past date
        if (bookingDTO.getBookingDate().isBefore(LocalDate.now())) {
            throw new ValidationException("Cannot book past date");
        }

        // Students can only book 1 booking per day
        if (user.getRole() == User.Role.STUDENT) {
            List<Booking> existingBookings = bookingRepository.findByUserIdAndBookingDate(
                    user.getId(),
                    bookingDTO.getBookingDate()
            );
            if (!existingBookings.isEmpty()) {
                throw new ValidationException("Students can only book one resource per day");
            }
        }

        // Check for conflicting bookings
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                bookingDTO.getResourceId(),
                bookingDTO.getBookingDate(),
                bookingDTO.getTimeSlot()
        );

        if (!conflicts.isEmpty()) {
            throw new ConflictException("Resource is already booked for the selected time slot");
        }

        // Create booking - PENDING for students, APPROVED for staff and admin
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResource(resource);
        booking.setBookingDate(bookingDTO.getBookingDate());
        booking.setTimeSlot(bookingDTO.getTimeSlot());
        
        // Staff and Admin bookings are auto-approved, student bookings need approval
        if (user.getRole() == User.Role.STAFF || user.getRole() == User.Role.ADMIN) {
            booking.setStatus(Booking.BookingStatus.APPROVED);
        } else {
            booking.setStatus(Booking.BookingStatus.PENDING);
        }
        
        // Validate time slot for students (1-3 hours only)
        // Staff and Admin can book any duration
        if (user.getRole() == User.Role.STUDENT) {
            if (bookingDTO.getTimeSlot() == Booking.TimeSlot.FOUR_HOURS ||
                bookingDTO.getTimeSlot() == Booking.TimeSlot.FIVE_HOURS) {
                throw new ValidationException("Students can only book 1-3 hour slots");
            }
            // Allow FULL_DAY, MORNING, AFTERNOON for backward compatibility
        }
        
        booking.setDeleted(false);

        Booking savedBooking = bookingRepository.save(booking);
        return convertToDTO(savedBooking);
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .filter(booking -> booking.getDeleted() == null || !booking.getDeleted()) // Handle null deleted field
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
                .filter(booking -> booking.getDeleted() == null || !booking.getDeleted()) // Handle null deleted field
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        // Check if booking date is in the past
        if (booking.getBookingDate().isBefore(LocalDate.now())) {
            throw new ValidationException("Cannot cancel past bookings");
        }

        // Soft delete
        booking.setDeleted(true);
        booking.setDeletedAt(LocalDateTime.now());
        bookingRepository.save(booking);
    }

    @Transactional
    public BookingDTO approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new ValidationException("Only pending bookings can be approved");
        }

        booking.setStatus(Booking.BookingStatus.APPROVED);
        Booking updatedBooking = bookingRepository.save(booking);
        return convertToDTO(updatedBooking);
    }

    @Transactional
    public BookingDTO rejectBooking(Long id, String rejectionReason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new ValidationException("Only pending bookings can be rejected");
        }

        if (rejectionReason == null || rejectionReason.trim().isEmpty()) {
            throw new ValidationException("Rejection reason is required");
        }

        booking.setStatus(Booking.BookingStatus.REJECTED);
        booking.setRejectionReason(rejectionReason);
        Booking updatedBooking = bookingRepository.save(booking);
        return convertToDTO(updatedBooking);
    }

    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser().getId());
        dto.setUserName(booking.getUser().getName());
        dto.setResourceId(booking.getResource().getId());
        dto.setResourceName(booking.getResource().getName());
        dto.setBookingDate(booking.getBookingDate());
        dto.setTimeSlot(booking.getTimeSlot());
        dto.setStatus(booking.getStatus());
        dto.setRejectionReason(booking.getRejectionReason());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}
