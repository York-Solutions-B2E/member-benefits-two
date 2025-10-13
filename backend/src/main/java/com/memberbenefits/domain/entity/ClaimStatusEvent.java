package com.memberbenefits.domain.entity;

import com.memberbenefits.domain.enums.ClaimStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "claim_status_events", indexes = {
    @Index(name = "idx_claim_status_event_claim_id", columnList = "claim_id"),
    @Index(name = "idx_claim_status_event_occurred_at", columnList = "occurred_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class ClaimStatusEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "uuid")
    private UUID id;
    
    @Column(name = "claim_id", nullable = false)
    @NotNull(message = "Claim ID is required")
    private UUID claimId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @NotNull(message = "Status is required")
    private ClaimStatus status;
    
    @Column(name = "occurred_at", nullable = false)
    @NotNull(message = "Occurred at timestamp is required")
    private OffsetDateTime occurredAt;
    
    @Column(name = "note")
    @Size(max = 500, message = "Note must not exceed 500 characters")
    private String note; // optional
}
