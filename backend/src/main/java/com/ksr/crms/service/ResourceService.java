package com.ksr.crms.service;

import com.ksr.crms.dto.ResourceDTO;
import com.ksr.crms.entity.Resource;
import com.ksr.crms.entity.User;
import com.ksr.crms.exception.ResourceNotFoundException;
import com.ksr.crms.exception.UnauthorizedException;
import com.ksr.crms.repository.ResourceRepository;
import com.ksr.crms.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    public ResourceService(ResourceRepository resourceRepository, UserRepository userRepository) {
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ResourceDTO createResource(ResourceDTO resourceDTO) {
        Resource resource = new Resource();
        resource.setName(resourceDTO.getName());
        resource.setType(resourceDTO.getType());
        resource.setCapacity(resourceDTO.getCapacity());
        resource.setStatus(resourceDTO.getStatus() != null ? resourceDTO.getStatus() : Resource.Status.AVAILABLE);

        Resource savedResource = resourceRepository.save(resource);
        return convertToDTO(savedResource);
    }

    public List<ResourceDTO> getAllResources() {
        return resourceRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ResourceDTO getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return convertToDTO(resource);
    }

    @Transactional
    public ResourceDTO updateResource(Long id, ResourceDTO resourceDTO) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resource.setName(resourceDTO.getName());
        resource.setType(resourceDTO.getType());
        resource.setCapacity(resourceDTO.getCapacity());
        resource.setStatus(resourceDTO.getStatus());

        Resource updatedResource = resourceRepository.save(resource);
        return convertToDTO(updatedResource);
    }

    @Transactional
    public void deleteResource(Long id, Long requestingUserId) {
        User requestingUser = userRepository.findById(requestingUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Requesting user not found"));

        if (requestingUser.getRole() != User.Role.ADMIN) {
            throw new UnauthorizedException("Only ADMIN can delete resources");
        }

        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found with id: " + id);
        }

        resourceRepository.deleteById(id);
    }

    private ResourceDTO convertToDTO(Resource resource) {
        ResourceDTO dto = new ResourceDTO();
        dto.setId(resource.getId());
        dto.setName(resource.getName());
        dto.setType(resource.getType());
        dto.setCapacity(resource.getCapacity());
        dto.setStatus(resource.getStatus());
        dto.setCreatedAt(resource.getCreatedAt());
        return dto;
    }
}
