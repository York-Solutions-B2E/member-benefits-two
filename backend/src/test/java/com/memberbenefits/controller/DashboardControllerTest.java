package com.memberbenefits.controller;

import com.memberbenefits.domain.entity.Member;
import com.memberbenefits.dto.DashboardDto;
import com.memberbenefits.service.AuthService;
import com.memberbenefits.service.DashboardService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DashboardController.class)
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private DashboardService dashboardService;

    @Test
    @WithMockUser
    void getDashboard_WithValidMember_ReturnsDashboardData() throws Exception {
        // Given
        Member member = new Member();
        member.setId(UUID.randomUUID());
        member.setFirstName("John");
        member.setLastName("Doe");
        member.setEmail("john.doe@example.com");

        DashboardDto dashboardDto = DashboardDto.builder()
                .activePlan(null)
                .accumulators(java.util.List.of())
                .recentClaims(java.util.List.of())
                .build();

        when(authService.getCurrentMember(any())).thenReturn(Optional.of(member));
        when(dashboardService.getDashboardData(member)).thenReturn(dashboardDto);

        // When & Then
        mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    @Test
    @WithMockUser
    void getDashboard_WithNoMember_ReturnsNotFound() throws Exception {
        // Given
        when(authService.getCurrentMember(any())).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getDashboard_WithoutAuthentication_ReturnsUnauthorized() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isUnauthorized());
    }
}
