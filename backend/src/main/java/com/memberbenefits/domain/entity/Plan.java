package com.memberbenefits.domain.entity;

import com.memberbenefits.domain.enums.PlanType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "plans", indexes = {
    @Index(name = "idx_plan_name", columnList = "name"),
    @Index(name = "idx_plan_year", columnList = "plan_year")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Plan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "uuid")
    private UUID id;
    
    @Column(name = "name", nullable = false)
    @NotBlank(message = "Plan name is required")
    @Size(max = 255, message = "Plan name must not exceed 255 characters")
    private String name; // e.g., "Gold PPO"
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    @NotNull(message = "Plan type is required")
    private PlanType type; // PPO/HMO/...
    
    @Column(name = "network_name", nullable = false)
    @NotBlank(message = "Network name is required")
    @Size(max = 255, message = "Network name must not exceed 255 characters")
    private String networkName; // e.g., "Prime"
    
    @Column(name = "plan_year", nullable = false)
    @NotNull(message = "Plan year is required")
    private Integer planYear; // e.g., 2025
}
