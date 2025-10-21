package com.memberbenefits.graphql.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Provider {
    private String id;
    private String name;
    private String specialty;
    
    public Provider(com.memberbenefits.dto.ProviderSummaryDto providerDto) {
        this.id = providerDto.getId();
        this.name = providerDto.getName();
        this.specialty = providerDto.getSpecialty();
    }
}