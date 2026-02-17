package com.ksr.crms.dto;

public class DashboardDTO {

    private Long totalUsers;
    private Long totalResources;
    private Long totalBookings;
    private Long totalApprovedBookings;

    // Constructors
    public DashboardDTO() {
    }

    public DashboardDTO(Long totalUsers, Long totalResources, Long totalBookings, Long totalApprovedBookings) {
        this.totalUsers = totalUsers;
        this.totalResources = totalResources;
        this.totalBookings = totalBookings;
        this.totalApprovedBookings = totalApprovedBookings;
    }

    // Getters and Setters
    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalResources() {
        return totalResources;
    }

    public void setTotalResources(Long totalResources) {
        this.totalResources = totalResources;
    }

    public Long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public Long getTotalApprovedBookings() {
        return totalApprovedBookings;
    }

    public void setTotalApprovedBookings(Long totalApprovedBookings) {
        this.totalApprovedBookings = totalApprovedBookings;
    }
}
