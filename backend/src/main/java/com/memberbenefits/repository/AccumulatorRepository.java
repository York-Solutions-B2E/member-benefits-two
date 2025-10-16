package com.memberbenefits.repository;

import com.memberbenefits.domain.entity.Accumulator;
import com.memberbenefits.domain.enums.AccumulatorType;
import com.memberbenefits.domain.enums.NetworkTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccumulatorRepository extends JpaRepository<Accumulator, UUID> {
   
    List<Accumulator> findByEnrollmentId(UUID enrollmentId);

    List<Accumulator> findByEnrollmentIdAndType(UUID enrollmentId, AccumulatorType type);

    List<Accumulator> findByEnrollmentIdAndTier(UUID enrollmentId, NetworkTier tier);
    
    Optional<Accumulator> findByEnrollmentIdAndTypeAndTier(UUID enrollmentId, AccumulatorType type, NetworkTier tier);
    
    @Query("SELECT a FROM Accumulator a WHERE a.enrollmentId = :enrollmentId AND a.type = :type ORDER BY a.tier")
    List<Accumulator> findByEnrollmentIdAndTypeOrderByTier(@Param("enrollmentId") UUID enrollmentId, @Param("type") AccumulatorType type);
    
    @Query("SELECT SUM(a.usedAmount) FROM Accumulator a WHERE a.enrollmentId = :enrollmentId AND a.type = :type")
    Optional<BigDecimal> getTotalUsedAmountByEnrollmentAndType(@Param("enrollmentId") UUID enrollmentId, @Param("type") AccumulatorType type);}