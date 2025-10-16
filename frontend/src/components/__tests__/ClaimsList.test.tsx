import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ClaimsList from '../ClaimsList';

// Mock the API calls
jest.mock('../services/api', () => ({
  claimsApi: {
    getClaimsList: jest.fn().mockResolvedValue({
      content: [
        {
          id: '1',
          claimNumber: 'C-10421',
          status: 'PROCESSED',
          serviceStartDate: '2024-08-29',
          serviceEndDate: '2024-08-29',
          totalMemberResponsibility: 45,
          provider: {
            id: '1',
            name: 'River Clinic',
            specialty: 'Primary Care'
          }
        }
      ],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true
    })
  }
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ClaimsList Component', () => {
  test('renders claims table headers', async () => {
    renderWithRouter(<ClaimsList />);
    
    await waitFor(() => {
      expect(screen.getByText('Claim #')).toBeInTheDocument();
      expect(screen.getByText('Service Dates')).toBeInTheDocument();
      expect(screen.getByText('Provider')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Member Responsibility')).toBeInTheDocument();
    });
  });

  test('renders filter controls', async () => {
    renderWithRouter(<ClaimsList />);
    
    await waitFor(() => {
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Date Range')).toBeInTheDocument();
      expect(screen.getByText('Provider')).toBeInTheDocument();
      expect(screen.getByText('Claim #')).toBeInTheDocument();
      expect(screen.getByText('Search')).toBeInTheDocument();
    });
  });

  test('renders status filter options', async () => {
    renderWithRouter(<ClaimsList />);
    
    await waitFor(() => {
      expect(screen.getByText('Submitted')).toBeInTheDocument();
      expect(screen.getByText('In Review')).toBeInTheDocument();
      expect(screen.getByText('Processed')).toBeInTheDocument();
      expect(screen.getByText('Paid')).toBeInTheDocument();
      expect(screen.getByText('Denied')).toBeInTheDocument();
    });
  });

  test('handles status filter changes', async () => {
    renderWithRouter(<ClaimsList />);
    
    await waitFor(() => {
      const submittedCheckbox = screen.getByLabelText('Submitted');
      fireEvent.click(submittedCheckbox);
      expect(submittedCheckbox).toBeChecked();
    });
  });

  test('renders pagination controls', async () => {
    renderWithRouter(<ClaimsList />);
    
    await waitFor(() => {
      expect(screen.getByText('Per page:')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    });
  });
});
