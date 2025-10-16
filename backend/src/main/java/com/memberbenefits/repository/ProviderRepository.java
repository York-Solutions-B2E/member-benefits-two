package com.memberbenefits.repository;

import com.memberbenefits.domain.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, UUID> {
    
    List<Provider> findByNameContainingIgnoreCase(String name);
    
    List<Provider> findBySpecialty(String specialty);
    
    List<Provider> findBySpecialtyContainingIgnoreCase(String specialty);
    
    @Query("SELECT p FROM Provider p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(p.specialty) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Provider> findByNameOrSpecialtyContainingIgnoreCase(@Param("name") String name, @Param("searchTerm") String searchTerm);
    
    @Query("SELECT p FROM Provider p WHERE p.address.city = :city")
    List<Provider> findByCity(@Param("city") String city);
    
    @Query("SELECT p FROM Provider p WHERE p.address.state = :state")
    List<Provider> findByState(@Param("state") String state);
    
    @Query("SELECT p FROM Provider p WHERE p.address.city = :city AND p.address.state = :state")
    List<Provider> findByCityAndState(@Param("city") String city, @Param("state") String state);
}