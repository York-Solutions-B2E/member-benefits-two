package com.memberbenefits.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {
    private ActivePlanDto activePlan;
    private List<AccumulatorDto> accumulators;
    private List<RecentClaimDto> recentClaims;
}
