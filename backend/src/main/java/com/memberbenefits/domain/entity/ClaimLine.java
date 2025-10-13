package com.memberbenefits.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "claim_lines", indexes = {
    @Index(name = "idx_claim_line_claim_id", columnList = "claim_id"),
    @Index(name = "idx_claim_line_line_number", columnList = "claim_id, line_number")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class ClaimLine {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "uuid")
    private UUID id;
    
    @Column(name = "claim_id", nullable = false)
    @NotNull(message = "Claim ID is required")
    private UUID claimId;
    
    @Column(name = "line_number", nullable = false)
    @NotNull(message = "Line number is required")
    private Integer lineNumber; // 1..n
    
    @Column(name = "cpt_code", nullable = false)
    @NotBlank(message = "CPT code is required")
    @Size(max = 10, message = "CPT code must not exceed 10 characters")
    private String cptCode; // e.g., "99213"
    
    @Column(name = "description", nullable = false)
    @NotBlank(message = "Description is required")
    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;
    
    @Column(name = "billed_amount", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Billed amount is required")
    @DecimalMin(value = "0.0", message = "Billed amount must be non-negative")
    private BigDecimal billedAmount;
    
    @Column(name = "allowed_amount", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Allowed amount is required")
    @DecimalMin(value = "0.0", message = "Allowed amount must be non-negative")
    private BigDecimal allowedAmount;
    
    @Column(name = "deductible_applied", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Deductible applied is required")
    @DecimalMin(value = "0.0", message = "Deductible applied must be non-negative")
    private BigDecimal deductibleApplied;
    
    @Column(name = "copay_applied", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Copay applied is required")
    @DecimalMin(value = "0.0", message = "Copay applied must be non-negative")
    private BigDecimal copayApplied;
    
    @Column(name = "coinsurance_applied", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Coinsurance applied is required")
    @DecimalMin(value = "0.0", message = "Coinsurance applied must be non-negative")
    private BigDecimal coinsuranceApplied;
    
    @Column(name = "plan_paid", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Plan paid amount is required")
    @DecimalMin(value = "0.0", message = "Plan paid amount must be non-negative")
    private BigDecimal planPaid;
    
    @Column(name = "member_responsibility", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Member responsibility is required")
    @DecimalMin(value = "0.0", message = "Member responsibility must be non-negative")
    private BigDecimal memberResponsibility;
}