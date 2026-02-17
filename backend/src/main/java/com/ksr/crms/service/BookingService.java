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

        // Check for conflicting bookings
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                bookingDTO.getResourceId(),
                bookingDTO.getBookingDate(),
                bookingDTO.getTimeSlot()
        );

        if (!conflicts.isEmpty()) {
            throw new ConflictException("Resource is already booked for the selected time slot");
        }

        // Create booking - auto-approved
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResource(resource);
        booking.setBookingDate(bookingDTO.getBookingDate());
        booking.setTimeSlot(bookingDTO.getTimeSlot());
        booking.setStatus(Booking.BookingStatus.APPROVED);
        booking.setDeleted(false);

        Booking savedBooking = bookingRepository.save(booking);
        return convertToDTO(savedBooking);
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .filter(booking -> !booking.getDeleted()) // Exclude soft-deleted bookings
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
                .filter(booking -> !booking.getDeleted()) // Exclude soft-deleted bookings
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
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}
