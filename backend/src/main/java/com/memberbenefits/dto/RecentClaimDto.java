package com.memberbenefits.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentClaimDto {
    private UUID id;
    private String claimNumber;
    private String status;
    private LocalDate serviceStartDate;
    private LocalDate serviceEndDate;
    private LocalDate receivedDate;
    private BigDecimal totalBilled;
    private BigDecimal totalAllowed;
    private BigDecimal totalPlanPaid;
    private BigDecimal totalMemberResponsibility;
    private String providerName;
}
