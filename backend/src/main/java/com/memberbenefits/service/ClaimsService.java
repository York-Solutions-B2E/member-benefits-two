package com.memberbenefits.service;

import com.memberbenefits.domain.entity.Claim;
import com.memberbenefits.domain.entity.Provider;
import com.memberbenefits.dto.ClaimSummaryDto;
import com.memberbenefits.dto.ClaimsListRequest;
import com.memberbenefits.dto.ClaimsListResponse;
import com.memberbenefits.dto.ProviderSummaryDto;
import com.memberbenefits.repository.ClaimRepository;
import com.memberbenefits.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClaimsService {
    
    private final ClaimRepository claimRepository;
    private final ProviderRepository providerRepository;
    
    @Transactional(readOnly = true)
    public ClaimsListResponse getClaimsList(UUID memberId, ClaimsListRequest request) {
        log.debug("Getting claims list for member: {} with filters: {}", memberId, request);
        
        // Create pageable with default sorting by received date DESC
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());
        
        // Execute the filtered query (without provider filter)
        Page<Claim> claimsPage = claimRepository.findClaimsWithFilters(
            memberId,
            request.getStatus(),
            request.getStartDate(),
            request.getEndDate(),
            request.getProvider(), // Pass but not used in query
            request.getClaimNumber(),
            pageable
        );
        
        // Get all provider IDs to fetch provider details
        List<UUID> providerIds = claimsPage.getContent().stream()
            .map(Claim::getProviderId)
            .distinct()
            .collect(Collectors.toList());
        
        // Fetch all providers in one query
        Map<UUID, Provider> providersMap = providerRepository.findAllById(providerIds)
            .stream()
            .collect(Collectors.toMap(Provider::getId, provider -> provider));
        
        // Convert claims to DTOs and apply provider filtering
        List<ClaimSummaryDto> claimDtos = claimsPage.getContent().stream()
            .map(claim -> convertToClaimSummaryDto(claim, providersMap.get(claim.getProviderId())))
            .filter(dto -> {
                // Apply provider filter if specified
                if (request.getProvider() != null && !request.getProvider().trim().isEmpty()) {
                    return dto.getProvider() != null && 
                           dto.getProvider().getName().toLowerCase()
                              .contains(request.getProvider().toLowerCase());
                }
                return true;
            })
            .collect(Collectors.toList());
        
        // Build response
        ClaimsListResponse response = new ClaimsListResponse();
        response.setContent(claimDtos);
        response.setPageNumber(claimsPage.getNumber());
        response.setPageSize(claimsPage.getSize());
        response.setTotalElements(claimsPage.getTotalElements());
        response.setTotalPages(claimsPage.getTotalPages());
        response.setFirst(claimsPage.isFirst());
        response.setLast(claimsPage.isLast());
        
        log.debug("Returning {} claims out of {} total", claimDtos.size(), claimsPage.getTotalElements());
        return response;
    }
    
    private ClaimSummaryDto convertToClaimSummaryDto(Claim claim, Provider provider) {
        ClaimSummaryDto dto = new ClaimSummaryDto();
        dto.setId(claim.getId().toString());
        dto.setClaimNumber(claim.getClaimNumber());
        dto.setStatus(claim.getStatus().name());
        dto.setServiceStartDate(claim.getServiceStartDate());
        dto.setServiceEndDate(claim.getServiceEndDate());
        dto.setTotalMemberResponsibility(claim.getTotalMemberResponsibility());
        
        if (provider != null) {
            ProviderSummaryDto providerDto = new ProviderSummaryDto();
            providerDto.setId(provider.getId().toString());
            providerDto.setName(provider.getName());
            providerDto.setSpecialty(provider.getSpecialty());
            dto.setProvider(providerDto);
        }
        
        return dto;
    }
}
