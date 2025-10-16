package com.memberbenefits.controller;

import com.memberbenefits.dto.ClaimDetailDto;
import com.memberbenefits.service.AuthService;
import com.memberbenefits.service.ClaimDetailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Claim Detail", description = "Claim detail endpoints")
public class ClaimDetailController {
    
    private final ClaimDetailService claimDetailService;
    private final AuthService authService;
    
    @GetMapping("/{claimNumber}")
    @Operation(
        summary = "Get claim detail",
        description = "Returns detailed information for a specific claim including line items and status history"
    )
    public ResponseEntity<ClaimDetailDto> getClaimDetail(
            @PathVariable String claimNumber,
            Authentication authentication) {
        log.debug("Getting claim detail for claim: {} and user: {}", claimNumber, authentication.getName());
        
        return authService.getCurrentMember(authentication)
            .map(member -> {
                ClaimDetailDto response = claimDetailService.getClaimDetail(member.getId(), claimNumber);
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}

