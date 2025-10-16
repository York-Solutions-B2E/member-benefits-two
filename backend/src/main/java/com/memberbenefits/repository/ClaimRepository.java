package com.memberbenefits.repository;

import com.memberbenefits.domain.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, UUID> {
    
    List<Claim> findByMemberIdOrderByServiceStartDateDesc(UUID memberId);
    
    @Query("SELECT c FROM Claim c WHERE c.member.id = :memberId ORDER BY c.serviceStartDate DESC")
    List<Claim> findTop5ByMemberIdOrderByServiceStartDateDesc(@Param("memberId") UUID memberId);
    
    Optional<Claim> findByClaimNumber(String claimNumber);
}
