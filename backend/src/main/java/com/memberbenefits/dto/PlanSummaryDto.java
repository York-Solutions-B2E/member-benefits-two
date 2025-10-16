package com.memberbenefits.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanSummaryDto {
    private String id;
    private String name;
    private String type;
    private String networkName;
    private Integer planYear;
}