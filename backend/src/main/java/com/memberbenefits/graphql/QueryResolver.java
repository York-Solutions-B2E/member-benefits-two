package com.memberbenefits.graphql;

import com.memberbenefits.domain.entity.Member;
import com.memberbenefits.dto.ClaimsListRequest;
import com.memberbenefits.dto.ClaimsListResponse;
import com.memberbenefits.graphql.dto.ClaimsConnection;
import com.memberbenefits.graphql.dto.ClaimsFilter;
import com.memberbenefits.graphql.dto.PaginationInput;
import com.memberbenefits.service.AuthService;
import com.memberbenefits.service.ClaimsService;
import graphql.kickstart.tools.GraphQLQueryResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class QueryResolver implements GraphQLQueryResolver {
    
    private final ClaimsService claimsService;
    private final AuthService authService;
    
    public ClaimsConnection claims(ClaimsFilter filters, PaginationInput pagination, Authentication authentication) {
        log.debug("GraphQL claims query with filters: {}, pagination: {}", filters, pagination);
        
        try {
            // Get current member
            Member member = authService.getCurrentMember(authentication)
                .orElseThrow(() -> new RuntimeException("User not authenticated"));
            
            // Convert GraphQL inputs to service layer DTOs
            ClaimsListRequest request = convertToClaimsListRequest(filters, pagination);
            
            // Get claims from service
            ClaimsListResponse response = claimsService.getClaimsList(member.getId(), request);
            
            // Convert to GraphQL response
            return new ClaimsConnection(response);
        } catch (Exception e) {
            log.error("Error processing GraphQL claims query", e);
            throw new RuntimeException("Failed to fetch claims: " + e.getMessage());
        }
    }
    
    private ClaimsListRequest convertToClaimsListRequest(ClaimsFilter filters, PaginationInput pagination) {
        ClaimsListRequest request = new ClaimsListRequest();
        
        if (filters != null) {
            request.setStatus(filters.getStatus());
            request.setStartDate(filters.getStartDate());
            request.setEndDate(filters.getEndDate());
            request.setProvider(filters.getProvider());
            request.setClaimNumber(filters.getClaimNumber());
        }
        
        if (pagination != null) {
            // Convert cursor-based pagination to offset-based
            int page = 0;
            int size = pagination.getFirst() != null ? pagination.getFirst() : 10;
            
            // Simple cursor handling - in production you'd decode the cursor properly
            if (pagination.getAfter() != null) {
                // For now, just use page 0 - you can implement proper cursor decoding later
                page = 0;
            }
            
            request.setPage(page);
            request.setSize(size);
        }
        
        return request;
    }
}