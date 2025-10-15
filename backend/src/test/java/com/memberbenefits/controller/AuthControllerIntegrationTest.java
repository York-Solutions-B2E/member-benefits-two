package com.memberbenefits.controller;

import com.memberbenefits.domain.entity.User;
import com.memberbenefits.repository.UserRepository;
import com.memberbenefits.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserRepository userRepository;
    
    @MockBean
    private AuthService authService;
    
    private User testUser;
    
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setAuthProvider("google");
        testUser.setAuthSub("test-sub-123");
        testUser.setEmail("test@example.com");
        testUser.setCreatedAt(OffsetDateTime.now());
        testUser.setUpdatedAt(OffsetDateTime.now());
        
        when(authService.getCurrentUser(any()))
            .thenReturn(Optional.of(testUser));
    }
    
    @Test
    @WithMockUser(username = "test@example.com")
    void shouldReturnCurrentUserWhenAuthenticated() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.authProvider").value("google"))
                .andExpect(jsonPath("$.authSub").value("test-sub-123"));
    }
    
    @Test
    @WithMockUser(username = "test@example.com")
    void shouldReturnNotFoundWhenUserNotFound() throws Exception {
        when(authService.getCurrentUser(any()))
            .thenReturn(Optional.empty());
        
        mockMvc.perform(get("/api/auth/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
    
    @Test
    void shouldReturnUnauthorizedWhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is3xxRedirection());
    }
}