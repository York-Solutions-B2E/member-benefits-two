package com.memberbenefits.graphql.dto;

import com.memberbenefits.domain.enums.ClaimStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Claim {
    private String id;
    private String claimNumber;
    private ClaimStatus status;
    private String serviceStartDate;
    private String serviceEndDate;
    private Double totalMemberResponsibility;
    private Provider provider;
    
    public Claim(com.memberbenefits.dto.ClaimSummaryDto claimDto) {
        this.id = claimDto.getId();
        this.claimNumber = claimDto.getClaimNumber();
        this.status = ClaimStatus.valueOf(claimDto.getStatus());
        this.serviceStartDate = claimDto.getServiceStartDate().toString();
        this.serviceEndDate = claimDto.getServiceEndDate().toString();
        this.totalMemberResponsibility = claimDto.getTotalMemberResponsibility().doubleValue();
        
        if (claimDto.getProvider() != null) {
            this.provider = new Provider(claimDto.getProvider());
        }
    }
    
    public Claim(com.memberbenefits.dto.ClaimDetailDto claimDto) {
        this.id = claimDto.getId();
        this.claimNumber = claimDto.getClaimNumber();
        this.status = ClaimStatus.valueOf(claimDto.getStatus());
        this.serviceStartDate = claimDto.getServiceStartDate().toString();
        this.serviceEndDate = claimDto.getServiceEndDate().toString();
        this.totalMemberResponsibility = claimDto.getTotalMemberResponsibility().doubleValue();
        
        if (claimDto.getProvider() != null) {
            this.provider = new Provider(claimDto.getProvider());
        }
    }
}