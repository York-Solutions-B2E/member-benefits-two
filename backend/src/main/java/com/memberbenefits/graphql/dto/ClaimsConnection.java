package com.memberbenefits.graphql.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimsConnection {
    private List<ClaimEdge> edges;
    private PageInfo pageInfo;
    private Long totalCount;
    
    public ClaimsConnection(com.memberbenefits.dto.ClaimsListResponse response) {
        this.edges = response.getContent().stream()
            .map(claim -> new ClaimEdge(claim, generateCursor(claim.getId())))
            .toList();
        
        this.pageInfo = new PageInfo();
        this.pageInfo.setHasNextPage(!response.isLast());
        this.pageInfo.setHasPreviousPage(!response.isFirst());
        this.pageInfo.setStartCursor(this.edges.isEmpty() ? null : this.edges.get(0).getCursor());
        this.pageInfo.setEndCursor(this.edges.isEmpty() ? null : this.edges.get(this.edges.size() - 1).getCursor());
        
        this.totalCount = response.getTotalElements();
    }
    
    private String generateCursor(String claimId) {
        // Simple base64 encoding of the claim ID for cursor
        return java.util.Base64.getEncoder().encodeToString(claimId.getBytes());
    }
}