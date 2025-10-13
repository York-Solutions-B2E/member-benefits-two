package com.memberbenefits.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_auth_provider_sub", columnList = "auth_provider, auth_sub", unique = true),
    @Index(name = "idx_user_email", columnList = "email")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "uuid")
    private UUID id;
    
    @Column(name = "auth_provider", nullable = false)
    @NotBlank(message = "Auth provider is required")
    @Size(max = 50, message = "Auth provider must not exceed 50 characters")
    private String authProvider; // e.g., "google", "okta"
    
    @Column(name = "auth_sub", nullable = false)
    @NotBlank(message = "Auth subject is required")
    @Size(max = 255, message = "Auth subject must not exceed 255 characters")
    private String authSub; // OIDC subject ("sub"), unique per provider
    
    @Column(name = "email", nullable = false)
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
