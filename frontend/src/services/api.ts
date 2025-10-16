import axios from 'axios';
import { User, DashboardData, Member, ClaimsListRequest, ClaimsListResponse, ClaimDetail, ClaimLine, ClaimStatusEvent } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session-based auth
});

export const authApi = {
  getCurrentUser: (): Promise<User> => 
    api.get('/api/auth/me').then(response => response.data),
  
  getCurrentMember: (): Promise<Member> => 
    api.get('/api/auth/member').then(response => response.data),


  logout: (): Promise<void> => 
    api.post('/logout').then(response => response.data),
};

export const dashboardApi = {
  getDashboardData: (): Promise<DashboardData> => 
    api.get('/api/dashboard').then(response => response.data),
};

export const claimsApi = {
  getClaimsList: (params: ClaimsListRequest): Promise<ClaimsListResponse> => 
    api.get('/api/claims', { params }).then(response => response.data),
  
  getClaimDetail: (claimId: string): Promise<ClaimDetail> => 
    api.get(`/api/claims/${claimId}`).then(response => response.data),
};

export default api;