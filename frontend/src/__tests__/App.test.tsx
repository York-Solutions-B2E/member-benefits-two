import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock API calls
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
  },
  claimsApi: {
    getClaimsList: jest.fn().mockResolvedValue({
      content: [],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true
    })
  }
}));

describe('App Integration Tests', () => {
  test('navigates from dashboard to claims', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText('View All Claims')).toBeInTheDocument();
    });

    // Click View All Claims
    fireEvent.click(screen.getByText('View All Claims'));

    // Should navigate to claims page
    await waitFor(() => {
      expect(screen.getByText('Claims')).toBeInTheDocument();
    });
  });

  test('navigates using breadcrumb', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Navigate to claims first
    await waitFor(() => {
      expect(screen.getByText('View All Claims')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('View All Claims'));

    // Click Dashboard in breadcrumb
    await waitFor(() => {
      const dashboardLink = screen.getByText('Dashboard');
      fireEvent.click(dashboardLink);
    });

    // Should navigate back to dashboard
    await waitFor(() => {
      expect(screen.getByText('Active Plan')).toBeInTheDocument();
    });
  });
});