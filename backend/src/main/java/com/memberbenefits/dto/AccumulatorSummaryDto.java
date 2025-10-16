package com.memberbenefits.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccumulatorSummaryDto {
    private String type; // DEDUCTIBLE or OOP_MAX
    private String tier; // IN_NETWORK or OUT_OF_NETWORK
    private BigDecimal limitAmount;
    private BigDecimal usedAmount;
    private BigDecimal remainingAmount;
}