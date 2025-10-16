package com.memberbenefits.service;

import com.memberbenefits.domain.entity.*;
import com.memberbenefits.dto.*;
import com.memberbenefits.repository.*;
import com.memberbenefits.domain.enums.NetworkTier;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {
    
    private final EnrollmentRepository enrollmentRepository;
    private final PlanRepository planRepository;
    private final AccumulatorRepository accumulatorRepository;
    private final ClaimRepository claimRepository;
    private final ProviderRepository providerRepository;
    
    @Transactional(readOnly = true)
    public DashboardResponse getDashboardData(UUID memberId) {
        log.debug("Getting dashboard data for member: {}", memberId);
        
        // Get active enrollment
        Enrollment activeEnrollment = enrollmentRepository
            .findByMemberIdAndActive(memberId, true)
            .stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("No active enrollment found for member"));
        
        // Get plan details
        Plan plan = planRepository.findById(activeEnrollment.getPlanId())
            .orElseThrow(() -> new RuntimeException("Plan not found"));
        
        // Get in-network accumulators
        List<Accumulator> accumulators = accumulatorRepository
            .findByEnrollmentIdAndTier(activeEnrollment.getId(), NetworkTier.IN_NETWORK);
        
        // Get recent claims (last 5)
        List<Claim> recentClaims = claimRepository
            .findByMemberId(memberId)
            .stream()
            .sorted((c1, c2) -> c2.getReceivedDate().compareTo(c1.getReceivedDate()))
            .limit(5)
            .collect(Collectors.toList());
        
        // Build response
        return new DashboardResponse(
            mapToPlanSummary(plan),
            mapToAccumulatorSummaries(accumulators),
            mapToClaimSummaries(recentClaims)
        );
    }
    
    private PlanSummaryDto mapToPlanSummary(Plan plan) {
        return new PlanSummaryDto(
            plan.getId().toString(),
            plan.getName(),
            plan.getType().toString(),
            plan.getNetworkName(),
            plan.getPlanYear()
        );
    }
    
    private List<AccumulatorSummaryDto> mapToAccumulatorSummaries(List<Accumulator> accumulators) {
        return accumulators.stream()
            .map(this::mapToAccumulatorSummary)
            .collect(Collectors.toList());
    }
    
    private AccumulatorSummaryDto mapToAccumulatorSummary(Accumulator accumulator) {
        BigDecimal remainingAmount = accumulator.getLimitAmount().subtract(accumulator.getUsedAmount());
        return new AccumulatorSummaryDto(
            accumulator.getType().toString(),
            accumulator.getTier().toString(),
            accumulator.getLimitAmount(),
            accumulator.getUsedAmount(),
            remainingAmount
        );
    }
    
    private List<ClaimSummaryDto> mapToClaimSummaries(List<Claim> claims) {
        return claims.stream()
            .map(this::mapToClaimSummary)
            .collect(Collectors.toList());
    }
    
    private ClaimSummaryDto mapToClaimSummary(Claim claim) {
        // Get provider details
        Provider provider = providerRepository.findById(claim.getProviderId())
            .orElse(null);
        
        ProviderSummaryDto providerSummary = provider != null ? 
            new ProviderSummaryDto(
                provider.getId().toString(),
                provider.getName(),
                provider.getSpecialty()
            ) : null;
        
        return new ClaimSummaryDto(
            claim.getId().toString(),
            claim.getClaimNumber(),
            claim.getStatus().toString(),
            claim.getServiceStartDate(),
            claim.getServiceEndDate(),
            claim.getTotalMemberResponsibility(),
            providerSummary
        );
    }
}