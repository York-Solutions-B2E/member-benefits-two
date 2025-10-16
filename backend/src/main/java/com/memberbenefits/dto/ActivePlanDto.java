package com.memberbenefits.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivePlanDto {
    private UUID id;
    private String name;
    private String type;
    private String networkName;
    private Integer planYear;
    private String coverageStart;
    private String coverageEnd;
}
