package com.memberbenefits.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "enrollments", indexes = {
    @Index(name = "idx_enrollment_member_id", columnList = "member_id"),
    @Index(name = "idx_enrollment_plan_id", columnList = "plan_id"),
    @Index(name = "idx_enrollment_active", columnList = "active")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Enrollment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "uuid")
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @NotNull(message = "Member is required")
    private Member member;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    @NotNull(message = "Plan is required")
    private Plan plan;
    
    @Column(name = "coverage_start", nullable = false)
    @NotNull(message = "Coverage start date is required")
    private LocalDate coverageStart;
    
    @Column(name = "coverage_end", nullable = false)
    @NotNull(message = "Coverage end date is required")
    private LocalDate coverageEnd;
    
    @Column(name = "active", nullable = false)
    @NotNull(message = "Active status is required")
    private Boolean active;
    
    @OneToMany(mappedBy = "enrollmentId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Accumulator> accumulators = new ArrayList<>();
}