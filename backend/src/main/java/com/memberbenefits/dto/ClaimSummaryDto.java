package com.memberbenefits.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimSummaryDto {
    private String id;
    private String claimNumber;
    private String status;
    private LocalDate serviceStartDate;
    private LocalDate serviceEndDate;
    private BigDecimal totalMemberResponsibility;
    private ProviderSummaryDto provider;
    
}
