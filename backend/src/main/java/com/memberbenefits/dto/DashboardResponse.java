package com.memberbenefits.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private PlanSummaryDto activePlan;
    private List<AccumulatorSummaryDto> inNetworkAccumulators;
    private List<ClaimSummaryDto> recentClaims;
}