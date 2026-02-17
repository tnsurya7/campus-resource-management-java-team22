package com.ksr.crms.dto;

import com.ksr.crms.entity.Booking;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingDTO {

    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    private String userName;

    @NotNull(message = "Resource ID is required")
    private Long resourceId;

    private String resourceName;

    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    @NotNull(message = "Time slot is required")
    private Booking.TimeSlot timeSlot;

    private Booking.BookingStatus status;

    private LocalDateTime createdAt;

    // Constructors
    public BookingDTO() {
    }

    public BookingDTO(Long id, Long userId, String userName, Long resourceId, String resourceName, 
                      LocalDate bookingDate, Booking.TimeSlot timeSlot, Booking.BookingStatus status, 
                      LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.bookingDate = bookingDate;
        this.timeSlot = timeSlot;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public Booking.TimeSlot getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(Booking.TimeSlot timeSlot) {
        this.timeSlot = timeSlot;
    }

    public Booking.BookingStatus getStatus() {
        return status;
    }

    public void setStatus(Booking.BookingStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
