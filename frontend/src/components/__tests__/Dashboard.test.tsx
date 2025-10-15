import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';
import { authApi, dashboardApi } from '../../services/api';

const mockAuthApi = authApi as jest.Mocked<typeof authApi>;
const mockDashboardApi = dashboardApi as jest.Mocked<typeof dashboardApi>;

describe('Dashboard Component', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    authProvider: 'google',
    authSub: 'test-sub-123',
    createdAt: '2025-01-01T00:00:00Z'
  };

  const mockDashboardData = {
    user: mockUser,
    activePlan: {
      id: '1',
      name: 'Gold PPO',
      networkName: 'Prime',
      planYear: 2025,
      type: 'PPO'
    },
    accumulators: [
      {
        id: '1',
        type: 'DEDUCTIBLE',
        tier: 'IN_NETWORK',
        limitAmount: 1500,
        usedAmount: 300
      }
    ],
    recentClaims: [
      {
        id: '1',
        claimNumber: 'C-10421',
        serviceStartDate: '2025-08-29',
        serviceEndDate: '2025-08-29',
        providerId: '1',
        provider: { id: '1', name: 'River Clinic', specialty: 'General Practice' },
        status: 'PROCESSED',
        totalMemberResponsibility: 45.00
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthApi.getCurrentUser.mockResolvedValue(mockUser);
    mockDashboardApi.getDashboardData.mockResolvedValue(mockDashboardData as any);
  });

  test('renders dashboard with user information', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  test('displays plan information', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Gold PPO')).toBeInTheDocument();
      expect(screen.getByText('Prime')).toBeInTheDocument();
    });
  });

  test('shows accumulator progress', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('$300 / $1500')).toBeInTheDocument();
    });
  });

  test('displays recent claims', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('C-10421')).toBeInTheDocument();
      expect(screen.getByText('River Clinic')).toBeInTheDocument();
      expect(screen.getByText('$45.00')).toBeInTheDocument();
    });
  });

  test('handles loading state', () => {
    mockDashboardApi.getDashboardData.mockImplementation(() => new Promise(() => {}));
    
    render(<Dashboard />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('handles error state', async () => {
    mockDashboardApi.getDashboardData.mockRejectedValue(new Error('API Error'));
    
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Error loading dashboard data')).toBeInTheDocument();
    });
  });
});