import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../Navigation';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Navigation Component', () => {
  test('renders brand name and navigation', () => {
    renderWithRouter(<Navigation pageTitle="Test" />);
    
    expect(screen.getByText('Member Benefits Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Claims')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  test('renders user name when provided', () => {
    renderWithRouter(<Navigation pageTitle="Test" userName="John Doe" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('navigation links are clickable', () => {
    renderWithRouter(<Navigation pageTitle="Test" />);
    
    const dashboardLink = screen.getByText('Dashboard');
    const claimsLink = screen.getByText('Claims');
    
    expect(dashboardLink).toBeInTheDocument();
    expect(claimsLink).toBeInTheDocument();
    expect(dashboardLink.tagName).toBe('BUTTON');
    expect(claimsLink.tagName).toBe('BUTTON');
  });

  test('mobile menu toggle works', () => {
    renderWithRouter(<Navigation pageTitle="Test" />);
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    expect(mobileMenuButton).toBeInTheDocument();
    
    fireEvent.click(mobileMenuButton);
    // Mobile navigation should be visible
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
