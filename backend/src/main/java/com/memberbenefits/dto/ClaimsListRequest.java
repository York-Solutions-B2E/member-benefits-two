package com.memberbenefits.dto;

import com.memberbenefits.domain.enums.ClaimStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimsListRequest {
    private List<ClaimStatus> status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String provider;
    private String claimNumber;
    private int page = 0;
    private int size = 10;
}
