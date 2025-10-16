package com.memberbenefits.domain.entity;

import com.memberbenefits.domain.enums.ClaimStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "claims", indexes = {
    @Index(name = "idx_claim_member_id", columnList = "member_id"),
    @Index(name = "idx_claim_provider_id", columnList = "provider_id"),
    @Index(name = "idx_claim_status", columnList = "status"),
    @Index(name = "idx_claim_received_date", columnList = "received_date"),
    @Index(name = "idx_claim_claim_number", columnList = "claim_number", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Claim {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "uuid")
    private UUID id;
    
    @Column(name = "claim_number", nullable = false, unique = true)
    @NotBlank(message = "Claim number is required")
    @Size(max = 50, message = "Claim number must not exceed 50 characters")
    private String claimNumber; // human-friendly key for UI
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @NotNull(message = "Member is required")
    private Member member;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    @NotNull(message = "Provider is required")
    private Provider provider;
    
    @Column(name = "service_start_date", nullable = false)
    @NotNull(message = "Service start date is required")
    private LocalDate serviceStartDate;
    
    @Column(name = "service_end_date", nullable = false)
    @NotNull(message = "Service end date is required")
    private LocalDate serviceEndDate;
    
    @Column(name = "received_date", nullable = false)
    @NotNull(message = "Received date is required")
    private LocalDate receivedDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @NotNull(message = "Claim status is required")
    private ClaimStatus status;
    
    @Column(name = "total_billed", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Total billed amount is required")
    @DecimalMin(value = "0.0", message = "Total billed amount must be non-negative")
    private BigDecimal totalBilled;
    
    @Column(name = "total_allowed", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Total allowed amount is required")
    @DecimalMin(value = "0.0", message = "Total allowed amount must be non-negative")
    private BigDecimal totalAllowed;
    
    @Column(name = "total_plan_paid", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Total plan paid amount is required")
    @DecimalMin(value = "0.0", message = "Total plan paid amount must be non-negative")
    private BigDecimal totalPlanPaid;
    
    @Column(name = "total_member_responsibility", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Total member responsibility is required")
    @DecimalMin(value = "0.0", message = "Total member responsibility must be non-negative")
    private BigDecimal totalMemberResponsibility;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
    
    @OneToMany(mappedBy = "claimId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ClaimLine> lines = new ArrayList<>();
    
    @OneToMany(mappedBy = "claimId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ClaimStatusEvent> statusHistory = new ArrayList<>();
}