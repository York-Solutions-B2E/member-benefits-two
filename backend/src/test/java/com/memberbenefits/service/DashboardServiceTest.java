package com.memberbenefits.service;

import com.memberbenefits.domain.entity.*;
import com.memberbenefits.domain.enums.AccumulatorType;
import com.memberbenefits.domain.enums.NetworkTier;
import com.memberbenefits.domain.enums.ClaimStatus;
import com.memberbenefits.domain.enums.PlanType;
import com.memberbenefits.dto.DashboardDto;
import com.memberbenefits.repository.ClaimRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private ClaimRepository claimRepository;

    @InjectMocks
    private DashboardService dashboardService;

    private Member member;
    private Enrollment enrollment;
    private Plan plan;
    private Accumulator deductibleAccumulator;
    private Accumulator oopAccumulator;
    private Claim claim1;
    private Claim claim2;
    private Provider provider;

    @BeforeEach
    void setUp() {
        // Create test data
        member = new Member();
        member.setId(UUID.randomUUID());
        member.setFirstName("John");
        member.setLastName("Doe");
        member.setEmail("john.doe@example.com");

        plan = new Plan();
        plan.setId(UUID.randomUUID());
        plan.setName("Gold PPO");
        plan.setType(PlanType.PPO);
        plan.setNetworkName("Prime");
        plan.setPlanYear(2025);

        enrollment = new Enrollment();
        enrollment.setId(UUID.randomUUID());
        enrollment.setMember(member);
        enrollment.setPlan(plan);
        enrollment.setCoverageStart(LocalDate.of(2025, 1, 1));
        enrollment.setCoverageEnd(LocalDate.of(2025, 12, 31));
        enrollment.setActive(true);

        deductibleAccumulator = new Accumulator();
        deductibleAccumulator.setId(UUID.randomUUID());
        deductibleAccumulator.setType(AccumulatorType.DEDUCTIBLE);
        deductibleAccumulator.setTier(NetworkTier.IN_NETWORK);
        deductibleAccumulator.setLimitAmount(new BigDecimal("1500.00"));
        deductibleAccumulator.setUsedAmount(new BigDecimal("300.00"));

        oopAccumulator = new Accumulator();
        oopAccumulator.setId(UUID.randomUUID());
        oopAccumulator.setType(AccumulatorType.OOP_MAX);
        oopAccumulator.setTier(NetworkTier.IN_NETWORK);
        oopAccumulator.setLimitAmount(new BigDecimal("6000.00"));
        oopAccumulator.setUsedAmount(new BigDecimal("1200.00"));

        enrollment.setAccumulators(List.of(deductibleAccumulator, oopAccumulator));
        member.setEnrollments(List.of(enrollment));

        provider = new Provider();
        provider.setId(UUID.randomUUID());
        provider.setName("River Clinic");
        provider.setSpecialty("Primary Care");

        claim1 = new Claim();
        claim1.setId(UUID.randomUUID());
        claim1.setClaimNumber("C-10421");
        claim1.setMember(member);
        claim1.setProvider(provider);
        claim1.setServiceStartDate(LocalDate.of(2024, 8, 29));
        claim1.setServiceEndDate(LocalDate.of(2024, 8, 29));
        claim1.setReceivedDate(LocalDate.of(2024, 8, 30));
        claim1.setStatus(ClaimStatus.PROCESSED);
        claim1.setTotalBilled(new BigDecimal("300.00"));
        claim1.setTotalAllowed(new BigDecimal("200.00"));
        claim1.setTotalPlanPaid(new BigDecimal("155.00"));
        claim1.setTotalMemberResponsibility(new BigDecimal("45.00"));

        claim2 = new Claim();
        claim2.setId(UUID.randomUUID());
        claim2.setClaimNumber("C-10422");
        claim2.setMember(member);
        claim2.setProvider(provider);
        claim2.setServiceStartDate(LocalDate.of(2024, 8, 15));
        claim2.setServiceEndDate(LocalDate.of(2024, 8, 15));
        claim2.setReceivedDate(LocalDate.of(2024, 8, 16));
        claim2.setStatus(ClaimStatus.PROCESSED);
        claim2.setTotalBilled(new BigDecimal("450.00"));
        claim2.setTotalAllowed(new BigDecimal("350.00"));
        claim2.setTotalPlanPaid(new BigDecimal("280.00"));
        claim2.setTotalMemberResponsibility(new BigDecimal("70.00"));

        member.setClaims(List.of(claim1, claim2));
    }

    @Test
    void getDashboardData_WithActiveEnrollment_ReturnsDashboardData() {
        // Given
        when(claimRepository.findTop5ByMemberIdOrderByServiceStartDateDesc(member.getId()))
                .thenReturn(List.of(claim1, claim2));

        // When
        DashboardDto result = dashboardService.getDashboardData(member);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getActivePlan()).isNotNull();
        assertThat(result.getActivePlan().getName()).isEqualTo("Gold PPO");
        assertThat(result.getActivePlan().getType()).isEqualTo("PPO");
        assertThat(result.getActivePlan().getNetworkName()).isEqualTo("Prime");
        assertThat(result.getActivePlan().getPlanYear()).isEqualTo(2025);
        assertThat(result.getActivePlan().getCoverageStart()).isEqualTo("2025-01-01");
        assertThat(result.getActivePlan().getCoverageEnd()).isEqualTo("2025-12-31");

        assertThat(result.getAccumulators()).hasSize(2);
        assertThat(result.getAccumulators().get(0).getType()).isEqualTo("DEDUCTIBLE");
        assertThat(result.getAccumulators().get(0).getLimitAmount()).isEqualTo(new BigDecimal("1500.00"));
        assertThat(result.getAccumulators().get(0).getUsedAmount()).isEqualTo(new BigDecimal("300.00"));

        assertThat(result.getAccumulators().get(1).getType()).isEqualTo("OOP_MAX");
        assertThat(result.getAccumulators().get(1).getLimitAmount()).isEqualTo(new BigDecimal("6000.00"));
        assertThat(result.getAccumulators().get(1).getUsedAmount()).isEqualTo(new BigDecimal("1200.00"));

        assertThat(result.getRecentClaims()).hasSize(2);
        assertThat(result.getRecentClaims().get(0).getClaimNumber()).isEqualTo("C-10421");
        assertThat(result.getRecentClaims().get(0).getStatus()).isEqualTo("PROCESSED");
        assertThat(result.getRecentClaims().get(0).getTotalMemberResponsibility()).isEqualTo(new BigDecimal("45.00"));
        assertThat(result.getRecentClaims().get(0).getProviderName()).isEqualTo("River Clinic");
    }

    @Test
    void getDashboardData_WithoutActiveEnrollment_ReturnsEmptyDashboard() {
        // Given
        member.setEnrollments(List.of()); // No enrollments

        // When
        DashboardDto result = dashboardService.getDashboardData(member);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getActivePlan()).isNull();
        assertThat(result.getAccumulators()).isEmpty();
        assertThat(result.getRecentClaims()).isEmpty();
    }

    @Test
    void getDashboardData_WithNoClaims_ReturnsEmptyClaims() {
        // Given
        when(claimRepository.findTop5ByMemberIdOrderByServiceStartDateDesc(member.getId()))
                .thenReturn(List.of());

        // When
        DashboardDto result = dashboardService.getDashboardData(member);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getActivePlan()).isNotNull();
        assertThat(result.getAccumulators()).hasSize(2);
        assertThat(result.getRecentClaims()).isEmpty();
    }
}
