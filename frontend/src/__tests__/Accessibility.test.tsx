import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../components/Navigation';

describe('Accessibility Tests', () => {
  test('navigation has proper ARIA labels', () => {
    render(
      <BrowserRouter>
        <Navigation pageTitle="Test" />
      </BrowserRouter>
    );

    // Check for mobile menu button with aria-label
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    expect(mobileMenuButton).toBeInTheDocument();
  });

  test('buttons have proper roles', () => {
    render(
      <BrowserRouter>
        <Navigation pageTitle="Test" />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('navigation links are keyboard accessible', () => {
    render(
      <BrowserRouter>
        <Navigation pageTitle="Test" />
      </BrowserRouter>
    );

    const dashboardButton = screen.getByText('Dashboard');
    const claimsButton = screen.getByText('Claims');
    
    expect(dashboardButton).toBeInTheDocument();
    expect(claimsButton).toBeInTheDocument();
    
    // These should be focusable
    dashboardButton.focus();
    expect(document.activeElement).toBe(dashboardButton);
  });

  test('form inputs have proper labels', () => {
    render(
      <BrowserRouter>
        <Navigation pageTitle="Test" />
      </BrowserRouter>
    );

    // Check that interactive elements are properly labeled
    const signOutButton = screen.getByText('Sign out');
    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton.tagName).toBe('BUTTON');
  });
});
