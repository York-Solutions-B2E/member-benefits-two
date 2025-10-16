import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock the API calls
jest.mock('../services/api', () => ({
  authApi: {
    getCurrentUser: jest.fn().mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      authProvider: 'google',
      authSub: 'test-sub',
      createdAt: '2024-01-01T00:00:00Z'
    }),
    getCurrentMember: jest.fn().mockResolvedValue({})
  },
  dashboardApi: {
    getDashboardData: jest.fn()
  }
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  test('renders loading state initially', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders all dashboard sections after loading', async () => {
    renderWithRouter(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Active Plan')).toBeInTheDocument();
      expect(screen.getByText('Accumulators')).toBeInTheDocument();
      expect(screen.getByText('Recent Claims')).toBeInTheDocument();
    });
  });

  test('displays plan information correctly', async () => {
    renderWithRouter(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Gold PPO')).toBeInTheDocument();
      expect(screen.getByText('Network: Prime')).toBeInTheDocument();
      expect(screen.getByText('Coverage 2025')).toBeInTheDocument();
    });
  });

  test('shows accumulator progress', async () => {
    renderWithRouter(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Deductible:')).toBeInTheDocument();
      expect(screen.getByText('OOP Max:')).toBeInTheDocument();
    });
  });

  test('displays recent claims', async () => {
    renderWithRouter(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('#C-10421')).toBeInTheDocument();
      expect(screen.getByText('#C-10405')).toBeInTheDocument();
    });
  });
});