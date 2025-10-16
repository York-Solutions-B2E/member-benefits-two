package com.memberbenefits.service;

import com.memberbenefits.domain.entity.Accumulator;
import com.memberbenefits.domain.entity.Claim;
import com.memberbenefits.domain.entity.Enrollment;
import com.memberbenefits.domain.entity.Member;
import com.memberbenefits.domain.entity.Plan;
import com.memberbenefits.domain.entity.Provider;
import com.memberbenefits.dto.AccumulatorDto;
import com.memberbenefits.dto.ActivePlanDto;
import com.memberbenefits.dto.DashboardDto;
import com.memberbenefits.dto.RecentClaimDto;
import com.memberbenefits.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final ClaimRepository claimRepository;

    @Transactional(readOnly = true)
    public DashboardDto getDashboardData(Member member) {
        log.debug("Getting dashboard data for member: {}", member.getId());

        // Get active enrollment and plan
        Enrollment activeEnrollment = member.getActiveEnrollment();
        if (activeEnrollment == null) {
            log.warn("No active enrollment found for member: {}", member.getId());
            return DashboardDto.builder()
                    .activePlan(null)
                    .accumulators(List.of())
                    .recentClaims(List.of())
                    .build();
        }

        Plan plan = activeEnrollment.getPlan();

        // Build active plan DTO
        ActivePlanDto activePlan = ActivePlanDto.builder()
                .id(plan.getId())
                .name(plan.getName())
                .type(plan.getType().name())
                .networkName(plan.getNetworkName())
                .planYear(plan.getPlanYear())
                .coverageStart(activeEnrollment.getCoverageStart().toString())
                .coverageEnd(activeEnrollment.getCoverageEnd().toString())
                .build();

        // Get accumulators
        List<AccumulatorDto> accumulators = activeEnrollment.getAccumulators().stream()
                .map(this::mapToAccumulatorDto)
                .collect(Collectors.toList());

        // Get recent claims (latest 5)
        List<Claim> recentClaims = claimRepository.findTop5ByMemberIdOrderByServiceStartDateDesc(member.getId())
                .stream()
                .limit(5)
                .collect(Collectors.toList());
        List<RecentClaimDto> recentClaimDtos = recentClaims.stream()
                .map(this::mapToRecentClaimDto)
                .collect(Collectors.toList());

        return DashboardDto.builder()
                .activePlan(activePlan)
                .accumulators(accumulators)
                .recentClaims(recentClaimDtos)
                .build();
    }

    private AccumulatorDto mapToAccumulatorDto(Accumulator accumulator) {
        return AccumulatorDto.builder()
                .id(accumulator.getId())
                .type(accumulator.getType().name())
                .tier(accumulator.getTier().name())
                .limitAmount(accumulator.getLimitAmount())
                .usedAmount(accumulator.getUsedAmount())
                .build();
    }

    private RecentClaimDto mapToRecentClaimDto(Claim claim) {
        Provider provider = claim.getProvider();
        String providerName = provider != null ? provider.getName() : "Unknown Provider";

        return RecentClaimDto.builder()
                .id(claim.getId())
                .claimNumber(claim.getClaimNumber())
                .status(claim.getStatus().name())
                .serviceStartDate(claim.getServiceStartDate())
                .serviceEndDate(claim.getServiceEndDate())
                .receivedDate(claim.getReceivedDate())
                .totalBilled(claim.getTotalBilled())
                .totalAllowed(claim.getTotalAllowed())
                .totalPlanPaid(claim.getTotalPlanPaid())
                .totalMemberResponsibility(claim.getTotalMemberResponsibility())
                .providerName(providerName)
                .build();
    }
}
