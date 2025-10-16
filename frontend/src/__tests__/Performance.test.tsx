import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

describe('Performance Tests', () => {
  test('dashboard renders within acceptable time', () => {
    const startTime = performance.now();
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });
});
