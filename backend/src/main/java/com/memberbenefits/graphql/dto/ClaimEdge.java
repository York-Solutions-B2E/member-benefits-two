package com.memberbenefits.graphql.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimEdge {
    private Claim node;
    private String cursor;

    public ClaimEdge(com.memberbenefits.dto.ClaimSummaryDto claim, String cursor) {
        this.node = new Claim(claim);
        this.cursor = cursor;
    }
}
