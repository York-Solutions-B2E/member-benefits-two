import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ClaimDetail from '../ClaimDetail';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ClaimDetail Component', () => {
  test('renders loading state initially', () => {
    renderWithRouter(<ClaimDetail />);
    expect(screen.getByText('Loading claim details...')).toBeInTheDocument();
  });

  test('renders claim header after loading', async () => {
    renderWithRouter(<ClaimDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Claim #C-10421')).toBeInTheDocument();
      expect(screen.getByText('River Clinic')).toBeInTheDocument();
    });
  });

  test('renders financial summary', async () => {
    renderWithRouter(<ClaimDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Financial Summary')).toBeInTheDocument();
      expect(screen.getByText('Total Billed')).toBeInTheDocument();
      expect(screen.getByText('Allowed Amount')).toBeInTheDocument();
      expect(screen.getByText('Plan Paid')).toBeInTheDocument();
      expect(screen.getByText('Member Responsibility')).toBeInTheDocument();
    });
  });

  test('renders line items table', async () => {
    renderWithRouter(<ClaimDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Line Items')).toBeInTheDocument();
      expect(screen.getByText('CPT')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Billed')).toBeInTheDocument();
    });
  });

  test('renders action buttons', async () => {
    renderWithRouter(<ClaimDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('← Back to Claims')).toBeInTheDocument();
      expect(screen.getByText('Download EOB PDF')).toBeInTheDocument();
    });
  });

  test('renders status timeline', async () => {
    renderWithRouter(<ClaimDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Status Timeline')).toBeInTheDocument();
    });
  });
});
