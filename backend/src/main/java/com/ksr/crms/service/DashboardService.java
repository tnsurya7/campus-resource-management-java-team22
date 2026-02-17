package com.ksr.crms.service;

import com.ksr.crms.dto.DashboardDTO;
import com.ksr.crms.repository.BookingRepository;
import com.ksr.crms.repository.ResourceRepository;
import com.ksr.crms.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final BookingRepository bookingRepository;

    public DashboardService(UserRepository userRepository, ResourceRepository resourceRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
        this.bookingRepository = bookingRepository;
    }

    public DashboardDTO getDashboardStats() {
        Long totalUsers = userRepository.count();
        Long totalResources = resourceRepository.count();
        Long totalBookings = bookingRepository.count();
        Long totalApprovedBookings = bookingRepository.countApprovedBookings();

        return new DashboardDTO(totalUsers, totalResources, totalBookings, totalApprovedBookings);
    }
}
