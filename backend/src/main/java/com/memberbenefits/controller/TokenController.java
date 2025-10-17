package com.memberbenefits.controller;

import com.memberbenefits.domain.entity.Token;
import com.memberbenefits.service.TokenService;
import com.memberbenefits.service.GoogleTokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Token Management", description = "Token refresh and management endpoints")
public class TokenController {
    
    private final TokenService tokenService;
    private final GoogleTokenService googleTokenService;
    
    @PostMapping("/refresh")
    @Operation(
        summary = "Refresh access token",
        description = "Uses refresh token to get new access token"
    )
    public ResponseEntity<Map<String, Object>> refreshToken(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "Unauthorized",
                "message", "Authentication required"
            ));
        }
        
        String userId = authentication.getName();
        log.debug("Refreshing token for user: {}", userId);
        
        try {
            // Get stored tokens for user
            Optional<Token> tokenOpt = tokenService.getTokensByUserId(userId);
            
            if (tokenOpt.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of(
                    "error", "No tokens found",
                    "message", "No refresh token available for user"
                ));
            }
            
            Token token = tokenOpt.get();
            
            // Check if refresh token exists
            if (token.getRefreshToken() == null || token.getRefreshToken().isEmpty()) {
                return ResponseEntity.status(401).body(Map.of(
                    "error", "No refresh token",
                    "message", "Refresh token not available"
                ));
            }
            
            // Call Google's token refresh API
            GoogleTokenService.TokenRefreshResponse refreshResponse = googleTokenService.refreshToken(token.getRefreshToken());

            if (refreshResponse.isSuccess()) {
                // Update tokens with new values from Google
                tokenService.updateTokens(
                    userId, 
                    refreshResponse.getAccessToken(), 
                    refreshResponse.getRefreshToken(), 
                    refreshResponse.getExpiresAt()
                );
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Token refreshed successfully");
                response.put("expiresAt", refreshResponse.getExpiresAt().toString());
                
                return ResponseEntity.ok(response);
            } else {
                log.error("Google token refresh failed: {}", refreshResponse.getError());
                return ResponseEntity.status(401).body(Map.of(
                    "error", "Token refresh failed",
                    "message", refreshResponse.getError()
                ));
            }
            
        } catch (Exception e) {
            log.error("Error refreshing token for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Internal server error",
                "message", "Failed to refresh token"
            ));
        }
    }
    
    @PostMapping("/logout")
    @Operation(
        summary = "Logout and clear tokens",
        description = "Clears stored tokens for the authenticated user"
    )
    public ResponseEntity<Map<String, Object>> logout(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "Unauthorized",
                "message", "Authentication required"
            ));
        }
        
        String userId = authentication.getName();
        log.debug("Logging out user: {}", userId);
        
        try {
            // Clear stored tokens
            tokenService.deleteTokensByUserId(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Logged out successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error logging out user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of(
                "error", "Internal server error",
                "message", "Failed to logout"
            ));
        }
    }
}