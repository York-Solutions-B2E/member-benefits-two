package com.memberbenefits.service;

import com.memberbenefits.domain.entity.Token;
import com.memberbenefits.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenService {
    
    private final TokenRepository tokenRepository;
    
    @Transactional
    public void saveTokens(String userId, String accessToken, String refreshToken, OffsetDateTime expiresAt) {
        // Delete existing tokens for user
        tokenRepository.deleteByUserId(userId);
        
        // Save new tokens
        Token token = Token.builder()
            .userId(userId)
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .expiresAt(expiresAt)
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();
            
        tokenRepository.save(token);
        log.debug("Saved tokens for user: {}", userId);
    }
    
    public Optional<Token> getTokensByUserId(String userId) {
        return tokenRepository.findByUserId(userId);
    }
    
    @Transactional
    public void deleteTokensByUserId(String userId) {
        tokenRepository.deleteByUserId(userId);
        log.debug("Deleted tokens for user: {}", userId);
    }
    
    public boolean isTokenExpired(Token token) {
        if (token == null || token.getExpiresAt() == null) {
            return true;
        }
        return OffsetDateTime.now().isAfter(token.getExpiresAt());
    }
    
    @Transactional
    public void updateTokens(String userId, String accessToken, String refreshToken, OffsetDateTime expiresAt) {
        Optional<Token> existingToken = tokenRepository.findByUserId(userId);
        
        if (existingToken.isPresent()) {
            Token token = existingToken.get();
            token.setAccessToken(accessToken);
            token.setRefreshToken(refreshToken);
            token.setExpiresAt(expiresAt);
            token.setUpdatedAt(OffsetDateTime.now());
            tokenRepository.save(token);
            log.debug("Updated tokens for user: {}", userId);
        } else {
            saveTokens(userId, accessToken, refreshToken, expiresAt);
        }
    }
}
