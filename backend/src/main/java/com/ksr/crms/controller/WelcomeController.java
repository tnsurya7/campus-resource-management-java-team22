package com.ksr.crms.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public Map<String, Object> welcome() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "Campus Resource Management System");
        response.put("version", "1.0.0");
        response.put("status", "running");
        response.put("swagger", "http://localhost:8080/swagger-ui/index.html");
        response.put("apiDocs", "http://localhost:8080/v3/api-docs");
        return response;
    }
}
