package com.memberbenefits.repository;
import com.memberbenefits.domain.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    
    List<Enrollment> findByMemberId(UUID memberId);

    List<Enrollment> findByPlanId(UUID planId);

    List<Enrollment> findByActive(Boolean active);

    List<Enrollment> findByMemberIdAndActive(UUID memberId, Boolean active);

    @Query("SELECT e FROM Enrollment e WHERE e.memberId = :memberId AND e.active = true AND :date BETWEEN e.coverageStart AND e.coverageEnd")
    Optional<Enrollment> findActiveEnrollmentForMemberOnDate(@Param("memberId") UUID memberId, @Param("date") LocalDate date);
    
    @Query("SELECT e FROM Enrollment e WHERE e.coverageStart <= :endDate AND e.coverageEnd >= :startDate")
    List<Enrollment> findEnrollmentsInDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
}
