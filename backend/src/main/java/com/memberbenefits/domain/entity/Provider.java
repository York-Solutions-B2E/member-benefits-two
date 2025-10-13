package com.memberbenefits.domain.entity;

import com.memberbenefits.domain.embeddable.Address;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "providers", indexes = {
    @Index(name = "idx_provider_name", columnList = "name"),
    @Index(name = "idx_provider_specialty", columnList = "specialty")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Provider {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "uuid")
    private UUID id;
    
    @Column(name = "name", nullable = false)
    @NotBlank(message = "Provider name is required")
    @Size(max = 255, message = "Provider name must not exceed 255 characters")
    private String name;
    
    @Column(name = "specialty")
    @Size(max = 100, message = "Specialty must not exceed 100 characters")
    private String specialty;
    
    @Embedded
    @Valid
    private Address address;
    
    @Column(name = "phone")
    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;
}