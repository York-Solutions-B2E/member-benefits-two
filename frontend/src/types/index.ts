export interface User {
    id: string;
    email: string;
    authProvider: string;
    authSub: string;
    createdAt: string;
}

export interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    phone: string;
    mailingAddress: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
    };
}

export interface PlanSummaryDto {
    id: string;
    name: string;     
    type: string;         
    networkName: string;  
    planYear: number;    
}

export interface AccumulatorSummaryDto {
    type: string;          // DEDUCTIBLE or OOP_MAX
    tier: string;          // IN_NETWORK or OUT_OF_NETWORK
    limitAmount: number;    
    usedAmount: number;    
    remainingAmount: number; // Calculated field
}

export interface ProviderSummaryDto {
    id: string;
    name: string;
    specialty: string;
}

export interface ClaimSummaryDto {
    id: string;
    claimNumber: string;    
    status: string;         // SUBMITTED, IN_REVIEW, PROCESSED, PAID, DENIED
    serviceStartDate: string;
    serviceEndDate: string;
    totalMemberResponsibility: number;
    provider?: ProviderSummaryDto;
}

export interface ClaimsListRequest {
  status?: string[];
  startDate?: string;
  endDate?: string;
  provider?: string;
  claimNumber?: string;
  page?: number;
  size?: number;
}

export interface ClaimsListResponse {
  content: ClaimSummaryDto[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface DashboardData {
    activePlan: PlanSummaryDto;
    inNetworkAccumulators: AccumulatorSummaryDto[];
    recentClaims: ClaimSummaryDto[];
}

// New types for Claim Detail
export interface ClaimDetail {
  id: string;
  claimNumber: string;
  status: string;
  serviceStartDate: string;
  serviceEndDate: string;
  provider: ProviderSummaryDto;
  totalBilled: number;
  totalAllowed: number;
  totalPlanPaid: number;
  totalMemberResponsibility: number;
  lines: ClaimLine[];
  statusHistory: ClaimStatusEvent[];
}

export interface ClaimLine {
  id: string;
  lineNumber: number;
  cptCode: string;
  description: string;
  billedAmount: number;
  allowedAmount: number;
  deductibleApplied: number;
  copayApplied: number;
  coinsuranceApplied: number;
  planPaid: number;
  memberResponsibility: number;
}

export interface ClaimStatusEvent {
  id: string;
  status: string;
  occurredAt: string;
  note?: string;
}