## 🎯 **Day 4 Dashboard API - Implementation Plan & Deliverables**

### **📋 Today's Deliverables**
By end of today, you'll have:
1. ✅ **Complete Dashboard API** (`GET /api/dashboard`)
2. ✅ **Working Dashboard UI** with live data
3. ✅ **Proper data aggregation** (plan + accumulators + recent claims)
4. ✅ **Database indexes** optimized for dashboard queries
5. ✅ **End-to-end testing** via Swagger and frontend

### **🏗️ Implementation Structure**

Based on your current codebase, here's exactly what needs to be created:

#### **1. Missing Repositories** (Required first)
```java
// Need to create these repositories:
- PlanRepository.java
- EnrollmentRepository.java  
- AccumulatorRepository.java
- ClaimRepository.java
- ProviderRepository.java
```

#### **2. Dashboard Response DTOs** (Backend)
```java
// New DTOs to create:
- DashboardResponse.java
- PlanSummaryDto.java
- AccumulatorSummaryDto.java
- ClaimSummaryDto.java
```

#### **3. Dashboard Service & Controller**
```java
// New classes:
- DashboardService.java (business logic)
- DashboardController.java (REST endpoint)
```

#### **4. Frontend API Fix**
```typescript
// Fix incomplete method in services/api.ts
dashboardApi.getDashboardData()
```

### **📝 Step-by-Step Implementation Plan**

#### **Step 1: Create Missing Repositories** (30 minutes)
Create these 5 repository interfaces in `backend/src/main/java/com/memberbenefits/repository/`:

**PlanRepository.java:**
```java
package com.memberbenefits.repository;

import com.memberbenefits.domain.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface PlanRepository extends JpaRepository<Plan, UUID> {
    // Basic CRUD operations inherited from JpaRepository
}
```

**EnrollmentRepository.java:**
```java
package com.memberbenefits.repository;

import com.memberbenefits.domain.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    
    @Query("SELECT e FROM Enrollment e WHERE e.memberId = :memberId AND e.active = true")
    Optional<Enrollment> findActiveEnrollmentByMemberId(@Param("memberId") UUID memberId);
}
```

**AccumulatorRepository.java:**
```java
package com.memberbenefits.repository;

import com.memberbenefits.domain.entity.Accumulator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface AccumulatorRepository extends JpaRepository<Accumulator, UUID> {
    
    @Query("SELECT a FROM Accumulator a WHERE a.enrollmentId = :enrollmentId AND a.tier = 'IN_NETWORK'")
    List<Accumulator> findInNetworkAccumulatorsByEnrollmentId(@Param("enrollmentId") UUID enrollmentId);
}
```

**ClaimRepository.java:**
```java
package com.memberbenefits.repository;

import com.memberbenefits.domain.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, UUID> {
    
    @Query("SELECT c FROM Claim c WHERE c.memberId = :memberId ORDER BY c.receivedDate DESC")
    List<Claim> findRecentClaimsByMemberId(@Param("memberId") UUID memberId);
    
    @Query("SELECT c FROM Claim c WHERE c.memberId = :memberId ORDER BY c.receivedDate DESC LIMIT 5")
    List<Claim> findTop5RecentClaimsByMemberId(@Param("memberId") UUID memberId);
}
```

**ProviderRepository.java:**
```java
package com.memberbenefits.repository;

import com.memberbenefits.domain.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, UUID> {
    // Basic CRUD operations inherited from JpaRepository
}
```

#### **Step 2: Create Dashboard DTOs** (20 minutes)
Create `backend/src/main/java/com/memberbenefits/dto/` package and add:

**DashboardResponse.java:**
```java
package com.memberbenefits.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private PlanSummaryDto activePlan;
    private List<AccumulatorSummaryDto> inNetworkAccumulators;
    private List<ClaimSummaryDto> recentClaims;
}
```

**PlanSummaryDto.java:**
```java
package com.memberbenefits.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanSummaryDto {
    private String id;
    private String name;
    private String type;
    private String networkName;
    private Integer planYear;
}
```

**AccumulatorSummaryDto.java:**
```java
package com.memberbenefits.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccumulatorSummaryDto {
    private String type; // DEDUCTIBLE or OOP_MAX
    private String tier; // IN_NETWORK or OUT_OF_NETWORK
    private BigDecimal limitAmount;
    private BigDecimal usedAmount;
    private BigDecimal remainingAmount;
}
```

**ClaimSummaryDto.java:**
```java
package com.memberbenefits.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimSummaryDto {
    private String id;
    private String claimNumber;
    private String status;
    private LocalDate serviceStartDate;
    private LocalDate serviceEndDate;
    private BigDecimal totalMemberResponsibility;
    private ProviderSummaryDto provider;
}
```

**ProviderSummaryDto.java:**
```java
package com.memberbenefits.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderSummaryDto {
    private String id;
    private String name;
    private String specialty;
}
```

#### **Step 3: Create Dashboard Service** (45 minutes)
**DashboardService.java:**
```java
package com.memberbenefits.service;

import com.memberbenefits.domain.entity.*;
import com.memberbenefits.dto.*;
import com.memberbenefits.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {
    
    private final MemberRepository memberRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PlanRepository planRepository;
    private final AccumulatorRepository accumulatorRepository;
    private final ClaimRepository claimRepository;
    private final ProviderRepository providerRepository;
    
    @Transactional(readOnly = true)
    public DashboardResponse getDashboardData(UUID memberId) {
        log.debug("Getting dashboard data for member: {}", memberId);
        
        // Get active enrollment
        Enrollment activeEnrollment = enrollmentRepository
            .findActiveEnrollmentByMemberId(memberId)
            .orElseThrow(() -> new RuntimeException("No active enrollment found for member"));
        
        // Get plan details
        Plan plan = planRepository.findById(activeEnrollment.getPlanId())
            .orElseThrow(() -> new RuntimeException("Plan not found"));
        
        // Get in-network accumulators
        List<Accumulator> accumulators = accumulatorRepository
            .findInNetworkAccumulatorsByEnrollmentId(activeEnrollment.getId());
        
        // Get recent claims (last 5)
        List<Claim> recentClaims = claimRepository
            .findTop5RecentClaimsByMemberId(memberId);
        
        // Build response
        return DashboardResponse.builder()
            .activePlan(mapToPlanSummary(plan))
            .inNetworkAccumulators(mapToAccumulatorSummaries(accumulators))
            .recentClaims(mapToClaimSummaries(recentClaims))
            .build();
    }
    
    private PlanSummaryDto mapToPlanSummary(Plan plan) {
        return new PlanSummaryDto(
            plan.getId().toString(),
            plan.getName(),
            plan.getType().toString(),
            plan.getNetworkName(),
            plan.getPlanYear()
        );
    }
    
    private List<AccumulatorSummaryDto> mapToAccumulatorSummaries(List<Accumulator> accumulators) {
        return accumulators.stream()
            .map(this::mapToAccumulatorSummary)
            .collect(Collectors.toList());
    }
    
    private AccumulatorSummaryDto mapToAccumulatorSummary(Accumulator accumulator) {
        BigDecimal remainingAmount = accumulator.getLimitAmount().subtract(accumulator.getUsedAmount());
        return new AccumulatorSummaryDto(
            accumulator.getType().toString(),
            accumulator.getTier().toString(),
            accumulator.getLimitAmount(),
            accumulator.getUsedAmount(),
            remainingAmount
        );
    }
    
    private List<ClaimSummaryDto> mapToClaimSummaries(List<Claim> claims) {
        return claims.stream()
            .map(this::mapToClaimSummary)
            .collect(Collectors.toList());
    }
    
    private ClaimSummaryDto mapToClaimSummary(Claim claim) {
        // Get provider details
        Provider provider = providerRepository.findById(claim.getProviderId())
            .orElse(null);
        
        ProviderSummaryDto providerSummary = provider != null ? 
            new ProviderSummaryDto(
                provider.getId().toString(),
                provider.getName(),
                provider.getSpecialty()
            ) : null;
        
        return new ClaimSummaryDto(
            claim.getId().toString(),
            claim.getClaimNumber(),
            claim.getStatus().toString(),
            claim.getServiceStartDate(),
            claim.getServiceEndDate(),
            claim.getTotalMemberResponsibility(),
            providerSummary
        );
    }
}
```

#### **Step 4: Create Dashboard Controller** (15 minutes)
**DashboardController.java:**
```java
package com.memberbenefits.controller;

import com.memberbenefits.dto.DashboardResponse;
import com.memberbenefits.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Dashboard", description = "Dashboard data endpoints")
public class DashboardController {
    
    private final DashboardService dashboardService;
    private final AuthService authService;
    
    @GetMapping
    @Operation(
        summary = "Get dashboard data",
        description = "Returns aggregated dashboard data including plan, accumulators, and recent claims"
    )
    public ResponseEntity<DashboardResponse> getDashboardData(Authentication authentication) {
        log.debug("Getting dashboard data for user: {}", authentication.getName());
        
        return authService.getCurrentMember(authentication)
            .map(member -> {
                DashboardResponse response = dashboardService.getDashboardData(member.getId());
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
```

#### **Step 5: Fix Frontend API Service** (10 minutes)
Update `frontend/src/services/api.ts`:
```typescript
export const dashboardApi = {
  getDashboardData: (): Promise<DashboardData> => 
    api.get('/api/dashboard').then(response => response.data),
};
```

#### **Step 6: Add Required Database Indexes** (10 minutes)
Create `backend/src/main/resources/db/migration/V11__add_dashboard_indexes.sql`:
```sql
-- V11__add_dashboard_indexes.sql
-- Additional indexes for dashboard queries

-- Index for finding active enrollments by member
CREATE INDEX idx_enrollment_member_active ON enrollments (member_id, active) WHERE active = true;

-- Index for claims by member ordered by received date (for recent claims)
CREATE INDEX idx_claims_member_received_date_desc ON claims (member_id, received_date DESC);

-- Composite index for accumulator queries
CREATE INDEX idx_accumulator_enrollment_tier ON accumulators (enrollment_id, tier);
```

### **⏱️ Time Estimates**
- **Repositories**: 30 minutes
- **DTOs**: 20 minutes  
- **Dashboard Service**: 45 minutes
- **Dashboard Controller**: 15 minutes
- **Frontend API fix**: 10 minutes
- **Database indexes**: 10 minutes
- **Testing & debugging**: 30 minutes

**Total estimated time: ~2.5 hours**

### **🧪 Testing Plan**
1. **Backend Testing**: Use Swagger UI at `http://localhost:8080/swagger-ui.html`
2. **Frontend Testing**: Verify dashboard loads with live data
3. **Database Verification**: Check that indexes are created and queries are optimized

### **🎯 Success Criteria**
By end of today, you should have:
- ✅ Dashboard API returning proper JSON with plan, accumulators, and recent claims
- ✅ Frontend dashboard displaying live data from backend
- ✅ Proper error handling for missing data scenarios
- ✅ Optimized database queries with indexes

Would you like me to help you implement any of these components step by step?