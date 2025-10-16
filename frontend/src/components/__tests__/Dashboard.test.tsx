import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import * as api from '../../services/api';
import { User, DashboardData, ActivePlan, Accumulator, RecentClaim } from '../../types';

// Mock the API module
jest.mock('../../services/api', () => ({
  authApi: {
    getCurrentUser: jest.fn(),
    getCurrentMember: jest.fn(),
    logout: jest.fn(),
  },
  dashboardApi: {
    getDashboardData: jest.fn(),
  },
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  authProvider: 'google',
  authSub: 'google-123',
  createdAt: '2024-01-01T00:00:00Z',
};

const mockActivePlan: ActivePlan = {
  id: 'plan-1',
  name: 'Gold PPO',
  type: 'PPO',
  networkName: 'Prime',
  planYear: 2025,
  coverageStart: '2025-01-01',
  coverageEnd: '2025-12-31',
};

const mockAccumulators: Accumulator[] = [
  {
    id: 'acc-1',
    type: 'DEDUCTIBLE',
    tier: 'IN_NETWORK',
    limitAmount: 1500,
    usedAmount: 300,
  },
  {
    id: 'acc-2',
    type: 'OOP_MAX',
    tier: 'IN_NETWORK',
    limitAmount: 6000,
    usedAmount: 1200,
  },
];

const mockRecentClaims: RecentClaim[] = [
  {
    id: 'claim-1',
    claimNumber: 'C-10421',
    status: 'PROCESSED',
    serviceStartDate: '2024-08-29',
    serviceEndDate: '2024-08-29',
    receivedDate: '2024-08-30',
    totalBilled: 300,
    totalAllowed: 200,
    totalPlanPaid: 155,
    totalMemberResponsibility: 45,
    providerName: 'River Clinic',
  },
  {
    id: 'claim-2',
    claimNumber: 'C-10422',
    status: 'PENDING',
    serviceStartDate: '2024-08-15',
    serviceEndDate: '2024-08-15',
    receivedDate: '2024-08-16',
    totalBilled: 450,
    totalAllowed: 350,
    totalPlanPaid: 280,
    totalMemberResponsibility: 70,
    providerName: 'City Imaging Center',
  },
];

const mockDashboardData: DashboardData = {
  activePlan: mockActivePlan,
  accumulators: mockAccumulators,
  recentClaims: mockRecentClaims,
};

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (api.authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (api.authApi.getCurrentMember as jest.Mock).mockResolvedValue({} as any);
    (api.dashboardApi.getDashboardData as jest.Mock).mockResolvedValue(mockDashboardData);
  });

  it('renders loading state initially', () => {
    renderDashboard();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders dashboard data when loaded successfully', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Member Benefits Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();
    });

    // Check active plan section
    expect(screen.getByText('Active Plan')).toBeInTheDocument();
    expect(screen.getByText('Gold PPO')).toBeInTheDocument();
    expect(screen.getByText('Network: Prime')).toBeInTheDocument();
    expect(screen.getByText('Coverage: 2025')).toBeInTheDocument();

    // Check accumulators section
    expect(screen.getByText('Accumulators')).toBeInTheDocument();
    expect(screen.getByText('DEDUCTIBLE: $300 / $1500')).toBeInTheDocument();
    expect(screen.getByText('OOP_MAX: $1200 / $6000')).toBeInTheDocument();

    // Check recent claims section
    expect(screen.getByText('Recent Claims')).toBeInTheDocument();
    expect(screen.getByText('#C-10421')).toBeInTheDocument();
    expect(screen.getByText('#C-10422')).toBeInTheDocument();
    expect(screen.getByText('PROCESSED')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(screen.getByText('$45')).toBeInTheDocument();
    expect(screen.getByText('$70')).toBeInTheDocument();

    // Check View All Claims button
    expect(screen.getByText('View All Claims')).toBeInTheDocument();
  });

  it('handles missing active plan gracefully', async () => {
    const dashboardDataWithoutPlan: DashboardData = {
      activePlan: undefined,
      accumulators: mockAccumulators,
      recentClaims: mockRecentClaims,
    };
    
    (api.dashboardApi.getDashboardData as jest.Mock).mockResolvedValue(dashboardDataWithoutPlan);
    
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('No active plan found')).toBeInTheDocument();
    });
  });

  it('handles missing accumulators gracefully', async () => {
    const dashboardDataWithoutAccumulators: DashboardData = {
      activePlan: mockActivePlan,
      accumulators: [],
      recentClaims: mockRecentClaims,
    };
    
    (api.dashboardApi.getDashboardData as jest.Mock).mockResolvedValue(dashboardDataWithoutAccumulators);
    
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('No accumulator data available')).toBeInTheDocument();
    });
  });

  it('handles missing claims gracefully', async () => {
    const dashboardDataWithoutClaims: DashboardData = {
      activePlan: mockActivePlan,
      accumulators: mockAccumulators,
      recentClaims: [],
    };
    
    (api.dashboardApi.getDashboardData as jest.Mock).mockResolvedValue(dashboardDataWithoutClaims);
    
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('No recent claims found')).toBeInTheDocument();
    });
  });

  it('navigates to claim detail when claim view button is clicked', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Recent Claims')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByText('View');
    viewButtons[0].click();

    expect(mockNavigate).toHaveBeenCalledWith('/claims/C-10421');
  });

  it('navigates to claims list when View All Claims button is clicked', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('View All Claims')).toBeInTheDocument();
    });

    screen.getByText('View All Claims').click();

    expect(mockNavigate).toHaveBeenCalledWith('/claims');
  });

  it('handles sign out correctly', async () => {
    // Mock window.location.href
    delete (window as any).location;
    (window as any).location = { href: '' };

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    screen.getByText('Sign Out').click();

    expect(window.location.href).toBe('http://localhost:8080/logout');
  });

  it('redirects to login on authentication error', async () => {
    (api.authApi.getCurrentUser as jest.Mock).mockRejectedValue(new Error('Authentication failed'));

    renderDashboard();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});