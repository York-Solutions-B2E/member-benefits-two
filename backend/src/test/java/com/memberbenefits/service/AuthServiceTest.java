package com.memberbenefits.service;

import com.memberbenefits.TestBase;
import com.memberbenefits.domain.entity.User;
import com.memberbenefits.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class AuthServiceTest extends TestBase {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserRepository userRepository;
    
    private OidcUser mockOidcUser;
    private Authentication mockAuthentication;
    
    @BeforeEach
    void setUp() {
        mockOidcUser = mock(OidcUser.class);
        mockAuthentication = mock(Authentication.class);
        
        when(mockOidcUser.getSubject()).thenReturn("test-sub-123");
        when(mockOidcUser.getEmail()).thenReturn("test@example.com");
        when(mockAuthentication.getPrincipal()).thenReturn(mockOidcUser);
    }
    
    @Test
    void shouldCreateNewUserWhenNotExists() {
        // When
        Optional<User> result = authService.getCurrentUser(mockAuthentication);
        
        // Then
        assertThat(result).isPresent();
        User user = result.get();
        assertThat(user.getEmail()).isEqualTo("test@example.com");
        assertThat(user.getAuthProvider()).isEqualTo("google");
        assertThat(user.getAuthSub()).isEqualTo("test-sub-123");
        
        // Verify user was saved
        Optional<User> savedUser = userRepository.findByAuthProviderAndAuthSub("google", "test-sub-123");
        assertThat(savedUser).isPresent();
    }
    
    @Test
    void shouldReturnExistingUserWhenExists() {
        // Given - create existing user
        User existingUser = new User();
        existingUser.setAuthProvider("google");
        existingUser.setAuthSub("test-sub-123");
        existingUser.setEmail("test@example.com");
        existingUser.setCreatedAt(OffsetDateTime.now());
        existingUser.setUpdatedAt(OffsetDateTime.now());
        userRepository.save(existingUser);
        
        // When
        Optional<User> result = authService.getCurrentUser(mockAuthentication);
        
        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(existingUser.getId());
    }
    
    @Test
    void shouldReturnEmptyWhenAuthenticationIsNull() {
        // When
        Optional<User> result = authService.getCurrentUser(null);
        
        // Then
        assertThat(result).isEmpty();
    }
}