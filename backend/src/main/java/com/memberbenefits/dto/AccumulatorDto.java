package com.memberbenefits.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccumulatorDto {
    private UUID id;
    private String type;
    private String tier;
    private BigDecimal limitAmount;
    private BigDecimal usedAmount;
}
