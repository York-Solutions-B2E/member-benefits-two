package com.memberbenefits.controller;

import com.memberbenefits.domain.entity.Member;
import com.memberbenefits.dto.DashboardDto;
import com.memberbenefits.service.AuthService;
import com.memberbenefits.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final AuthService authService;
    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDto> getDashboard(Authentication authentication) {
        log.debug("Getting dashboard data for authentication: {}", authentication.getName());

        Optional<Member> currentMember = authService.getCurrentMember(authentication);
        if (currentMember.isEmpty()) {
            log.warn("No current member found for authentication: {}", authentication.getName());
            return ResponseEntity.notFound().build();
        }

        DashboardDto dashboardData = dashboardService.getDashboardData(currentMember.get());
        return ResponseEntity.ok(dashboardData);
    }
}
