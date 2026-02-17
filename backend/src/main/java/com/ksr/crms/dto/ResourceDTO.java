package com.ksr.crms.dto;

import com.ksr.crms.entity.Resource;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class ResourceDTO {

    private Long id;

    @NotBlank(message = "Resource name is required")
    private String name;

    private String type;

    @Min(value = 1, message = "Capacity must be greater than 0")
    private Integer capacity;

    private Resource.Status status;

    private LocalDateTime createdAt;

    // Constructors
    public ResourceDTO() {
    }

    public ResourceDTO(Long id, String name, String type, Integer capacity, Resource.Status status, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.capacity = capacity;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Resource.Status getStatus() {
        return status;
    }

    public void setStatus(Resource.Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
