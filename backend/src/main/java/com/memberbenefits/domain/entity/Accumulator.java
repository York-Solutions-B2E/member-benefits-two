package com.memberbenefits.domain.entity;

import com.memberbenefits.domain.enums.AccumulatorType;
import com.memberbenefits.domain.enums.NetworkTier;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "accumulators", indexes = {
    @Index(name = "idx_accumulator_enrollment_id", columnList = "enrollment_id"),
    @Index(name = "idx_accumulator_type_tier", columnList = "type, tier")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Accumulator {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "uuid")
    private UUID id;
    
    @Column(name = "enrollment_id", nullable = false)
    @NotNull(message = "Enrollment ID is required")
    private UUID enrollmentId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    @NotNull(message = "Accumulator type is required")
    private AccumulatorType type; // DEDUCTIBLE or OOP_MAX
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tier", nullable = false)
    @NotNull(message = "Network tier is required")
    private NetworkTier tier; // IN_NETWORK/OUT_OF_NETWORK
    
    @Column(name = "limit_amount", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Limit amount is required")
    @DecimalMin(value = "0.0", message = "Limit amount must be non-negative")
    private BigDecimal limitAmount; // e.g., 1500.00
    
    @Column(name = "used_amount", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Used amount is required")
    @DecimalMin(value = "0.0", message = "Used amount must be non-negative")
    private BigDecimal usedAmount; // e.g., 300.00
}
