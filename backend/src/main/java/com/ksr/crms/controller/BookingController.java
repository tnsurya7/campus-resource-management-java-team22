package com.ksr.crms.controller;

import com.ksr.crms.dto.BookingDTO;
import com.ksr.crms.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@Tag(name = "Booking API", description = "Booking management endpoints")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<BookingDTO> createBooking(@Valid @RequestBody BookingDTO bookingDTO) {
        BookingDTO createdBooking = bookingService.createBooking(bookingDTO);
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all bookings")
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        List<BookingDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        BookingDTO booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get bookings by user ID")
    public ResponseEntity<List<BookingDTO>> getBookingsByUserId(@PathVariable Long userId) {
        List<BookingDTO> bookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update booking (ADMIN only)")
    public ResponseEntity<BookingDTO> updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingDTO bookingDTO,
            @RequestHeader("X-User-Id") Long requestingUserId) {
        BookingDTO updatedBooking = bookingService.updateBooking(id, bookingDTO, requestingUserId);
        return ResponseEntity.ok(updatedBooking);
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve booking (ADMIN only)")
    public ResponseEntity<BookingDTO> approveBooking(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long approverId) {
        BookingDTO approvedBooking = bookingService.approveBooking(id, approverId);
        return ResponseEntity.ok(approvedBooking);
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject booking (ADMIN only)")
    public ResponseEntity<BookingDTO> rejectBooking(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long rejecterId,
            @RequestBody Map<String, String> payload) {
        String rejectionReason = payload.get("rejectionReason");
        BookingDTO rejectedBooking = bookingService.rejectBooking(id, rejecterId, rejectionReason);
        return ResponseEntity.ok(rejectedBooking);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete booking (ADMIN only)")
    public ResponseEntity<Void> deleteBooking(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long requestingUserId) {
        bookingService.deleteBooking(id, requestingUserId);
        return ResponseEntity.noContent().build();
    }
}
