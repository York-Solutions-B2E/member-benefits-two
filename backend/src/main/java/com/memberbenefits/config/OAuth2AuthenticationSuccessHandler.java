package com.memberbenefits.config;

import com.memberbenefits.service.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.OffsetDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    
    private final TokenService tokenService;
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, 
                                      HttpServletResponse response, 
                                      Authentication authentication) throws IOException {
        
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String userId = oauth2User.getAttribute("sub"); // Use 'sub' instead of 'name'
        
        log.debug("OAuth2 authentication successful for user: {}", userId);
        
        // Extract actual tokens from OAuth2User
        String accessToken = null;
        String refreshToken = null;
        OffsetDateTime expiresAt = null;
        
        // Get tokens from OAuth2User attributes
        if (oauth2User.getAttributes().containsKey("access_token")) {
            accessToken = (String) oauth2User.getAttributes().get("access_token");
        }
        
        if (oauth2User.getAttributes().containsKey("refresh_token")) {
            refreshToken = (String) oauth2User.getAttributes().get("refresh_token");
        }
        
        // Calculate expiration time (Google tokens typically expire in 1 hour)
        if (oauth2User.getAttributes().containsKey("expires_in")) {
            Integer expiresIn = (Integer) oauth2User.getAttributes().get("expires_in");
            expiresAt = OffsetDateTime.now().plusSeconds(expiresIn);
        } else {
            expiresAt = OffsetDateTime.now().plusHours(1); // Default fallback
        }
        
        // Store actual tokens
        if (accessToken != null && refreshToken != null) {
            tokenService.saveTokens(userId, accessToken, refreshToken, expiresAt);
            log.debug("Stored real tokens for user: {}", userId);
        } else {
            log.warn("Could not extract tokens for user: {}", userId);
        }
        
        // Redirect to frontend
        response.sendRedirect("http://localhost:3000/dashboard");
    }
}