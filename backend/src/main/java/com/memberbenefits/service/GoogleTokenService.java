package com.memberbenefits.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleTokenService {
    
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;
    
    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public TokenRefreshResponse refreshToken(String refreshToken) {
        try {
            String tokenUrl = "https://oauth2.googleapis.com/token";
            
            // Prepare request body
            MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
            requestBody.add("client_id", clientId);
            requestBody.add("client_secret", clientSecret);
            requestBody.add("refresh_token", refreshToken);
            requestBody.add("grant_type", "refresh_token");
            
            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);
            
            // Make the request
            ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, request, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                
                String newAccessToken = jsonNode.get("access_token").asText();
                String newRefreshToken = jsonNode.has("refresh_token") ? 
                    jsonNode.get("refresh_token").asText() : refreshToken;
                int expiresIn = jsonNode.get("expires_in").asInt();
                
                OffsetDateTime expiresAt = OffsetDateTime.now().plusSeconds(expiresIn);
                
                return TokenRefreshResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .expiresAt(expiresAt)
                    .success(true)
                    .build();
                    
            } else {
                log.error("Token refresh failed with status: {}", response.getStatusCode());
                return TokenRefreshResponse.builder()
                    .success(false)
                    .error("Token refresh failed")
                    .build();
            }
            
        } catch (Exception e) {
            log.error("Error refreshing token: {}", e.getMessage(), e);
            return TokenRefreshResponse.builder()
                .success(false)
                .error("Token refresh error: " + e.getMessage())
                .build();
        }
    }
    
    @lombok.Data
    @lombok.Builder
    public static class TokenRefreshResponse {
        private String accessToken;
        private String refreshToken;
        private OffsetDateTime expiresAt;
        private boolean success;
        private String error;
    }
}