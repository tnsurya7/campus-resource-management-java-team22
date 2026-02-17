package com.ksr.crms.controller;

import com.ksr.crms.dto.AuthResponse;
import com.ksr.crms.dto.UserDTO;
import com.ksr.crms.security.JwtUtil;
import com.ksr.crms.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication API", description = "Authentication endpoints")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and get JWT token")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        UserDTO user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());
        
        // Don't send password in response
        user.setPassword(null);
        
        AuthResponse response = new AuthResponse(token, user);
        return ResponseEntity.ok(response);
    }

    // Inner class for login request
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
