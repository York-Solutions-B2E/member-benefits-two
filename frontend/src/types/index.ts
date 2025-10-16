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

export interface ActivePlan {
    id: string;
    name: string;     
    type: string;         
    networkName: string;  
    planYear: number;
    coverageStart: string;
    coverageEnd: string;
}
  
export interface Accumulator {
    id: string;
    type: string;          
    tier: string;          
    limitAmount: number;    
    usedAmount: number;         
}

export interface Provider {
    id: string;
    name: string;
    specialty: string;
}

export interface RecentClaim {
    id: string;
    claimNumber: string;    
    status: string;         // SUBMITTED, IN_REVIEW, PROCESSED, PAID, DENIED
    serviceStartDate: string;
    serviceEndDate: string;
    receivedDate: string;
    totalBilled: number;
    totalAllowed: number;
    totalPlanPaid: number;
    totalMemberResponsibility: number;
    providerName: string;
}

export interface DashboardData {
    activePlan?: ActivePlan;
    accumulators?: Accumulator[];
    recentClaims?: RecentClaim[];
}