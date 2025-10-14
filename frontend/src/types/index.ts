export interface User {
    id: string;
    email: string;
    authProvider: string;
    authSub: string;
    createdAt: string;
}
  
export interface Plan {
    id: string;
    name: string;     
    type: string;         
    networkName: string;  
    planYear: number;    
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

export interface Claim {
    id: string;
    claimNumber: string;    
    providerId: string;
    serviceStartDate: string;
    serviceEndDate: string;
    status: string;         // SUBMITTED, IN_REVIEW, PROCESSED, PAID, DENIED
    totalMemberResponsibility: number;
    provider?: Provider;
}

export interface DashboardData {
    user: User;
    activePlan?: Plan;
    accumulators?: Accumulator[];
    recentClaims?: Claim[];
}