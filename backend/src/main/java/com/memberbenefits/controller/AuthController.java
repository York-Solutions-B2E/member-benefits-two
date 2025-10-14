package com.memberbenefits.controller;

import com.memberbenefits.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {
    
    private final AuthService authService;
    
    @GetMapping("/me")
    @Operation(
        summary = "Get current user information",
        description = "Returns the current authenticated user's basic information"
    )
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        log.debug("Getting current user for authentication: {}", authentication.getName());
        
        return authService.getCurrentUser(authentication)
            .map(user -> {
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.getId());
                response.put("email", user.getEmail());
                response.put("authProvider", user.getAuthProvider());
                response.put("authSub", user.getAuthSub());
                response.put("createdAt", user.getCreatedAt());
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}

