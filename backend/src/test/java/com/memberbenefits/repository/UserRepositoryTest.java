package com.memberbenefits.repository;

import com.memberbenefits.domain.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.time.OffsetDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void shouldFindUserByAuthProviderAndAuthSub() {
        // Given
        User user = new User();
        user.setAuthProvider("google");
        user.setAuthSub("google-oauth2|123456789");
        user.setEmail("test@example.com");
        user.setCreatedAt(OffsetDateTime.now());
        user.setUpdatedAt(OffsetDateTime.now());
        
        entityManager.persistAndFlush(user);
        
        // When
        Optional<User> found = userRepository.findByAuthProviderAndAuthSub("google", "google-oauth2|123456789");
        
        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("test@example.com");
        assertThat(found.get().getAuthProvider()).isEqualTo("google");
        assertThat(found.get().getAuthSub()).isEqualTo("google-oauth2|123456789");
    }
    
    @Test
    void shouldReturnEmptyWhenUserNotFound() {
        // When
        Optional<User> found = userRepository.findByAuthProviderAndAuthSub("google", "nonexistent");
        
        // Then
        assertThat(found).isEmpty();
    }
}

