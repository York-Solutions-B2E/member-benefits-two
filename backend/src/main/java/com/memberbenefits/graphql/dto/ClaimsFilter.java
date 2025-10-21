package com.memberbenefits.graphql.dto;

import com.memberbenefits.domain.enums.ClaimStatus;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ClaimsFilter {
    private List<ClaimStatus> status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String provider;
    private String claimNumber;
}
