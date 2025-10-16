package com.memberbenefits.repository;

import com.memberbenefits.domain.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlanRepository extends JpaRepository<Plan, UUID> {
    
    List<Plan> findByPlanYear(Integer planYear);

    List<Plan> findByType(String type);

    Optional<Plan> findByName(String name);

    List<Plan> findByNetworkName(String networkName);
}
