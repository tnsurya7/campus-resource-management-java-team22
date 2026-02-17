package com.ksr.crms.service;

import com.ksr.crms.dto.PageResponse;
import com.ksr.crms.dto.UserDTO;
import com.ksr.crms.entity.User;
import com.ksr.crms.exception.ConflictException;
import com.ksr.crms.exception.ResourceNotFoundException;
import com.ksr.crms.exception.UnauthorizedException;
import com.ksr.crms.exception.ValidationException;
import com.ksr.crms.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserDTO createUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new ConflictException("Email already exists: " + userDTO.getEmail());
        }

        if (userDTO.getPassword() == null || userDTO.getPassword().trim().isEmpty()) {
            throw new ValidationException("Password is required");
        }

        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword())); // Hash password
        user.setPhone(userDTO.getPhone());
        user.setRole(userDTO.getRole());
        user.setStatus(userDTO.getStatus() != null ? userDTO.getStatus() : User.Status.ACTIVE);
        user.setFailedLoginAttempts(0);
        user.setDeleted(false);

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    public PageResponse<UserDTO> getAllUsers(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage;
        
        if (status != null) {
            User.Status userStatus = User.Status.valueOf(status.toUpperCase());
            userPage = userRepository.findByStatusAndDeletedFalse(userStatus, pageable);
        } else {
            userPage = userRepository.findByDeletedFalse(pageable);
        }
        
        List<UserDTO> users = userPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageResponse<>(
                users,
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages()
        );
    }

    public List<UserDTO> getUsersByStatus(User.Status status) {
        return userRepository.findByStatus(status).stream()
                .filter(user -> !user.getDeleted())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return convertToDTO(user);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (!user.getEmail().equals(userDTO.getEmail()) && userRepository.existsByEmail(userDTO.getEmail())) {
            throw new ConflictException("Email already exists: " + userDTO.getEmail());
        }

        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        user.setRole(userDTO.getRole());
        user.setStatus(userDTO.getStatus());

        // Only update password if provided
        if (userDTO.getPassword() != null && !userDTO.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Soft delete
        user.setDeleted(true);
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    // Authentication method with rate limiting
    @Transactional
    public UserDTO authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        // Check if account is locked
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new UnauthorizedException("Account is locked. Please try again later.");
        }

        // Check if account is deleted
        if (user.getDeleted()) {
            throw new UnauthorizedException("Account not found");
        }

        // Verify password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            handleFailedLogin(user);
            throw new UnauthorizedException("Invalid credentials");
        }

        // Check if account is active
        if (user.getStatus() != User.Status.ACTIVE) {
            throw new UnauthorizedException("Account is inactive");
        }

        // Reset failed login attempts on successful login
        if (user.getFailedLoginAttempts() > 0) {
            user.setFailedLoginAttempts(0);
            user.setLockedUntil(null);
            userRepository.save(user);
        }

        return convertToDTO(user);
    }

    private void handleFailedLogin(User user) {
        user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
        
        if (user.getFailedLoginAttempts() >= 3) {
            user.setLockedUntil(LocalDateTime.now().plusMinutes(15));
            user.setStatus(User.Status.INACTIVE);
        }
        
        userRepository.save(user);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
