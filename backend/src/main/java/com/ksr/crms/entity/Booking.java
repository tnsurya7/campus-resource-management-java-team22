package com.ksr.crms.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings", indexes = {
    @Index(name = "idx_booking_date_resource_timeslot", columnList = "booking_date, resource_id, time_slot"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_resource_id", columnList = "resource_id")
})
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;

    @Column(nullable = false)
    private LocalDate bookingDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TimeSlot timeSlot;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(length = 500)
    private String rejectionReason;

    @Column(nullable = true) // Nullable for existing records
    private Boolean deleted = false;

    private LocalDateTime deletedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum TimeSlot {
        // Legacy values (for backward compatibility with existing data)
        MORNING,
        AFTERNOON,
        // New values
        ONE_HOUR,      // 1 hour (Students & Staff)
        TWO_HOURS,     // 2 hours (Students & Staff)
        THREE_HOURS,   // 3 hours (Students & Staff)
        FOUR_HOURS,    // 4 hours (Staff only)
        FIVE_HOURS,    // 5 hours (Staff only)
        FULL_DAY       // Full day (Staff only)
    }

    public enum BookingStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    // Constructors
    public Booking() {
    }

    public Booking(Long id, User user, Resource resource, LocalDate bookingDate, TimeSlot timeSlot, 
                   BookingStatus status, String rejectionReason, Boolean deleted, LocalDateTime deletedAt, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.resource = resource;
        this.bookingDate = bookingDate;
        this.timeSlot = timeSlot;
        this.status = status;
        this.rejectionReason = rejectionReason;
        this.deleted = deleted;
        this.deletedAt = deletedAt;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public TimeSlot getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(TimeSlot timeSlot) {
        this.timeSlot = timeSlot;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
