package com.memberbenefits.controller;

import com.memberbenefits.domain.entity.Member;
import com.memberbenefits.domain.enums.ClaimStatus;
import com.memberbenefits.dto.ClaimsListRequest;
import com.memberbenefits.dto.ClaimsListResponse;
import com.memberbenefits.service.AuthService;
import com.memberbenefits.service.ClaimsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
@Slf4j
public class ClaimsController {
    
    private final ClaimsService claimsService;
    private final AuthService authService;
    
    @GetMapping
    public ResponseEntity<ClaimsListResponse> getClaimsList(
            Authentication authentication,
            @RequestParam(required = false) List<ClaimStatus> status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String provider,
            @RequestParam(required = false) String claimNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.debug("Claims list request - status: {}, startDate: {}, endDate: {}, provider: {}, claimNumber: {}, page: {}, size: {}", 
                 status, startDate, endDate, provider, claimNumber, page, size);
        
        // Get current member
        Optional<Member> memberOpt = authService.getCurrentMember(authentication);
        if (memberOpt.isEmpty()) {
            log.warn("No authenticated member found");
            return ResponseEntity.status(401).build();
        }
        
        Member member = memberOpt.get();
        
        // Build request object
        ClaimsListRequest request = new ClaimsListRequest();
        request.setStatus(status);
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        request.setProvider(provider);
        request.setClaimNumber(claimNumber);
        request.setPage(page);
        request.setSize(size);
        
        // Get claims list
        ClaimsListResponse response = claimsService.getClaimsList(member.getId(), request);
        
        return ResponseEntity.ok(response);
    }
}
