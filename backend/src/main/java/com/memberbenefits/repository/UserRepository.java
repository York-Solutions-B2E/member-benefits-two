package com.memberbenefits.repository;

import com.memberbenefits.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByAuthProviderAndAuthSub(String authProvider, String authSub);
    
    Optional<User> findByEmail(String email);
}

