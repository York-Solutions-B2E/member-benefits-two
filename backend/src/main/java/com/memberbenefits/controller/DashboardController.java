// Rest endpoint to expose dashboard data
package com.memberbenefits.controller;

import com.memberbenefits.dto.DashboardResponse;
import com.memberbenefits.service.AuthService;
import com.memberbenefits.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Dashboard", description = "Dashboard data endpoints")
public class DashboardController {
    
    // Dependency Injection - Spring will automatically inject the dependencies
    private final DashboardService dashboardService;
    private final AuthService authService;

    @GetMapping // Maps HTTP GET requests to the /api/dashboard endpoint
    @Operation( 
        summary = "Get dashboard data",
        description = "Returns aggregated dashboard data including plan, accumulators, and recent claims"
    )
    public ResponseEntity<DashboardResponse> getDashboardData(Authentication authentication) {
        log.debug("Getting dashboard data for user: {}", authentication.getName());
        
        // Controller Logic Flow:
        // 1. Extract user context from spring security context
        // 2. Delegate business logic to DashboardService
        // 3. Handle response formatting
        // 4. Return HTTP response
        return authService.getCurrentMember(authentication)
            .map(member -> {
                DashboardResponse response = dashboardService.getDashboardData(member.getId());
                return ResponseEntity.ok(response); // Http 200
            })
            .orElse(ResponseEntity.notFound().build()); // Http 404
    }
}
