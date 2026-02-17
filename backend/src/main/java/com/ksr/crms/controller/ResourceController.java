package com.ksr.crms.controller;

import com.ksr.crms.dto.ResourceDTO;
import com.ksr.crms.service.ResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resources")
@Tag(name = "Resource API", description = "Resource management endpoints")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping
    @Operation(summary = "Create a new resource")
    public ResponseEntity<ResourceDTO> createResource(@Valid @RequestBody ResourceDTO resourceDTO) {
        ResourceDTO createdResource = resourceService.createResource(resourceDTO);
        return new ResponseEntity<>(createdResource, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all resources")
    public ResponseEntity<List<ResourceDTO>> getAllResources() {
        List<ResourceDTO> resources = resourceService.getAllResources();
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get resource by ID")
    public ResponseEntity<ResourceDTO> getResourceById(@PathVariable Long id) {
        ResourceDTO resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(resource);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update resource")
    public ResponseEntity<ResourceDTO> updateResource(@PathVariable Long id, @Valid @RequestBody ResourceDTO resourceDTO) {
        ResourceDTO updatedResource = resourceService.updateResource(id, resourceDTO);
        return ResponseEntity.ok(updatedResource);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete resource (ADMIN only)")
    public ResponseEntity<Void> deleteResource(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long requestingUserId) {
        resourceService.deleteResource(id, requestingUserId);
        return ResponseEntity.noContent().build();
    }
}
