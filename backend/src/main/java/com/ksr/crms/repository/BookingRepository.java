package com.ksr.crms.repository;

import com.ksr.crms.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'APPROVED'")
    Long countApprovedBookings();

    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId " +
           "AND b.bookingDate = :bookingDate " +
           "AND b.status = 'APPROVED' " +
           "AND ((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findConflictingBookings(
            @Param("resourceId") Long resourceId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
}
