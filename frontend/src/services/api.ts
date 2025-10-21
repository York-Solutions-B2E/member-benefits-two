import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { User, DashboardData, Member, ClaimsListRequest, ClaimsListResponse, ClaimDetail, ClaimLine, ClaimStatusEvent } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session-based auth
});

// Track if we're currently refreshing to avoid multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Enhanced response interceptor with retry logic and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't try to refresh if the original request was to /api/auth/me
      // This prevents infinite loops when checking authentication status
      if (originalRequest.url?.includes('/api/auth/me')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the session by calling the auth endpoint
        await api.get('/api/auth/me');
        
        // If successful, process queued requests
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        processQueue(refreshError, null);
        
        // Show user-friendly error message
        if (window.location.pathname !== '/login') {
          // You might want to show a toast notification here
          console.warn('Session expired. Please log in again.');
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 403) {
      // Handle 403 Forbidden with user-friendly message
      console.warn('Access denied. You do not have permission to perform this action.');
      // You might want to show a toast notification here
      return Promise.reject(error);
    }

    // Handle other errors with user-friendly messages
    if (error.response?.status && error.response.status >= 500) {
      console.error('Server error. Please try again later.');
    } else if (error.response?.status && error.response.status >= 400) {
      console.error('Request failed. Please check your input and try again.');
    }

    return Promise.reject(error);
  }
);

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

export const downloadEob = async (claimId: string): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/api/claims/${claimId}/eob`, {
    method: 'GET',
    credentials: 'include', // Include session cookies
  });
  
  if (!response.ok) {
    throw new Error('Failed to download EOB');
  }
  
  return response.blob();
};

export default api;