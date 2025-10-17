package com.memberbenefits.service;

import com.memberbenefits.domain.entity.Claim;
import com.memberbenefits.domain.entity.ClaimLine;
import com.memberbenefits.domain.entity.ClaimStatusEvent;
import com.memberbenefits.domain.entity.Provider;
import com.memberbenefits.dto.*;
import com.memberbenefits.repository.ClaimRepository;
import com.memberbenefits.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClaimDetailService {
    
    private final ClaimRepository claimRepository;
    private final ProviderRepository providerRepository;
    
    @Transactional(readOnly = true)
    public ClaimDetailDto getClaimDetailById(UUID memberId, UUID claimId) {
        log.debug("Getting claim detail for member: {} and claim ID: {}", memberId, claimId);
        
        Claim claim = claimRepository.findById(claimId)
            .filter(c -> c.getMemberId().equals(memberId)) // Security check
            .orElseThrow(() -> new RuntimeException("Claim not found"));
        
        Provider provider = providerRepository.findById(claim.getProviderId())
            .orElse(null);
        
        // Get claim lines
        List<ClaimLineDto> lines = claim.getLines().stream()
            .map(this::mapToClaimLineDto)
            .collect(Collectors.toList());
        
        // Get status history
        List<ClaimStatusEventDto> statusHistory = claim.getStatusHistory().stream()
            .map(this::mapToClaimStatusEventDto)
            .collect(Collectors.toList());
        
        // Build response
        ClaimDetailDto dto = new ClaimDetailDto();
        dto.setId(claim.getId().toString());
        dto.setClaimNumber(claim.getClaimNumber());
        dto.setStatus(claim.getStatus().toString());
        dto.setServiceStartDate(claim.getServiceStartDate());
        dto.setServiceEndDate(claim.getServiceEndDate());
        dto.setTotalBilled(claim.getTotalBilled());
        dto.setTotalAllowed(claim.getTotalAllowed());
        dto.setTotalPlanPaid(claim.getTotalPlanPaid());
        dto.setTotalMemberResponsibility(claim.getTotalMemberResponsibility());
        dto.setLines(lines);
        dto.setStatusHistory(statusHistory);
        
        if (provider != null) {
            ProviderSummaryDto providerDto = new ProviderSummaryDto(
                provider.getId().toString(),
                provider.getName(),
                provider.getSpecialty()
            );
            dto.setProvider(providerDto);
        }
        
        return dto;
    }
    
    @Transactional(readOnly = true)
    public ClaimDetailDto getClaimDetail(UUID memberId, String claimNumber) {
        log.debug("Getting claim detail for member: {} and claim: {}", memberId, claimNumber);
        
        Claim claim = claimRepository.findByMemberIdAndClaimNumber(memberId, claimNumber)
            .orElseThrow(() -> new RuntimeException("Claim not found"));
        
        Provider provider = providerRepository.findById(claim.getProviderId())
            .orElse(null);
        
        // Get claim lines
        List<ClaimLineDto> lines = claim.getLines().stream()
            .map(this::mapToClaimLineDto)
            .collect(Collectors.toList());
        
        // Get status history
        List<ClaimStatusEventDto> statusHistory = claim.getStatusHistory().stream()
            .map(this::mapToClaimStatusEventDto)
            .collect(Collectors.toList());
        
        // Build response
        ClaimDetailDto dto = new ClaimDetailDto();
        dto.setId(claim.getId().toString());
        dto.setClaimNumber(claim.getClaimNumber());
        dto.setStatus(claim.getStatus().toString());
        dto.setServiceStartDate(claim.getServiceStartDate());
        dto.setServiceEndDate(claim.getServiceEndDate());
        dto.setTotalBilled(claim.getTotalBilled());
        dto.setTotalAllowed(claim.getTotalAllowed());
        dto.setTotalPlanPaid(claim.getTotalPlanPaid());
        dto.setTotalMemberResponsibility(claim.getTotalMemberResponsibility());
        dto.setLines(lines);
        dto.setStatusHistory(statusHistory);
        
        if (provider != null) {
            ProviderSummaryDto providerDto = new ProviderSummaryDto(
                provider.getId().toString(),
                provider.getName(),
                provider.getSpecialty()
            );
            dto.setProvider(providerDto);
        }
        
        return dto;
    }
    
    private ClaimLineDto mapToClaimLineDto(ClaimLine line) {
        return new ClaimLineDto(
            line.getId().toString(),
            line.getLineNumber(),
            line.getCptCode(),
            line.getDescription(),
            line.getBilledAmount(),
            line.getAllowedAmount(),
            line.getDeductibleApplied(),
            line.getCopayApplied(),
            line.getCoinsuranceApplied(),
            line.getPlanPaid(),
            line.getMemberResponsibility()
        );
    }
    
    private ClaimStatusEventDto mapToClaimStatusEventDto(ClaimStatusEvent event) {
        return new ClaimStatusEventDto(
            event.getId().toString(),
            event.getStatus().toString(),
            event.getOccurredAt(),
            event.getNote()
        );
    }
}

