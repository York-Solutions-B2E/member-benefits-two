package com.memberbenefits.repository;

import com.memberbenefits.domain.entity.Claim;
import com.memberbenefits.domain.enums.ClaimStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, UUID> {
    
    List<Claim> findByMemberId(UUID memberId);
    
    List<Claim> findByProviderId(UUID providerId);
    
    List<Claim> findByStatus(ClaimStatus status);
    
    List<Claim> findByMemberIdAndStatus(UUID memberId, ClaimStatus status);
    
    Optional<Claim> findByClaimNumber(String claimNumber);
    
    Optional<Claim> findByMemberIdAndClaimNumber(UUID memberId, String claimNumber);
    
    List<Claim> findByReceivedDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Claim> findByServiceStartDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT c FROM Claim c WHERE c.memberId = :memberId AND c.serviceStartDate BETWEEN :startDate AND :endDate ORDER BY c.serviceStartDate DESC")
    List<Claim> findClaimsForMemberInDateRange(@Param("memberId") UUID memberId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT c FROM Claim c WHERE c.providerId = :providerId AND c.status = :status ORDER BY c.receivedDate DESC")
    List<Claim> findClaimsByProviderAndStatus(@Param("providerId") UUID providerId, @Param("status") ClaimStatus status);
    
    @Query("SELECT COUNT(c) FROM Claim c WHERE c.memberId = :memberId AND c.status = :status")
    Long countClaimsByMemberAndStatus(@Param("memberId") UUID memberId, @Param("status") ClaimStatus status);
    
    // Simple query without JOIN - handle provider filtering in service layer
    @Query("SELECT c FROM Claim c " +
           "WHERE c.memberId = :memberId " +
           "AND (:status IS NULL OR c.status IN :status) " +
           "AND (:startDate IS NULL OR c.serviceStartDate >= :startDate) " +
           "AND (:endDate IS NULL OR c.serviceEndDate <= :endDate) " +
           "AND (:claimNumber IS NULL OR c.claimNumber = :claimNumber) " +
           "ORDER BY c.receivedDate DESC")
    Page<Claim> findClaimsWithFilters(
        @Param("memberId") UUID memberId,
        @Param("status") List<ClaimStatus> status,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("provider") String provider, // Keep for compatibility but don't use
        @Param("claimNumber") String claimNumber,
        Pageable pageable
    );
}