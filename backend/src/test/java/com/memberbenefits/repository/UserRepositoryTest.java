package com.memberbenefits.repository;

import com.memberbenefits.TestBase;
import com.memberbenefits.domain.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.OffsetDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class UserRepositoryTest extends TestBase {
    
    @Autowired
    private UserRepository userRepository;
    
    private User testUser;
    
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setAuthProvider("google");
        testUser.setAuthSub("test-sub-123");
        testUser.setEmail("test@example.com");
        testUser.setCreatedAt(OffsetDateTime.now());
        testUser.setUpdatedAt(OffsetDateTime.now());
        
        userRepository.save(testUser);
    }
    
    @Test
    void shouldFindUserByAuthProviderAndAuthSub() {
        // When
        Optional<User> found = userRepository.findByAuthProviderAndAuthSub("google", "test-sub-123");
        
        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("test@example.com");
        assertThat(found.get().getAuthProvider()).isEqualTo("google");
    }
    
    @Test
    void shouldReturnEmptyWhenUserNotFound() {
        // When
        Optional<User> found = userRepository.findByAuthProviderAndAuthSub("google", "non-existent");
        
        // Then
        assertThat(found).isEmpty();
    }
}