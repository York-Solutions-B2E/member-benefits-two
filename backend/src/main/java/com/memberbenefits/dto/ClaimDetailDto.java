package com.memberbenefits.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimDetailDto {
    private String id;
    private String claimNumber;
    private String status;
    private LocalDate serviceStartDate;
    private LocalDate serviceEndDate;
    private ProviderSummaryDto provider;
    private BigDecimal totalBilled;
    private BigDecimal totalAllowed;
    private BigDecimal totalPlanPaid;
    private BigDecimal totalMemberResponsibility;
    private List<ClaimLineDto> lines;
    private List<ClaimStatusEventDto> statusHistory;
}

