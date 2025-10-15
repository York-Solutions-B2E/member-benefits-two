import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, DashboardData } from '../types';
import { authApi, dashboardApi } from '../services/api';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async (): Promise<void> => {
    try {
      // First get user data from /api/auth/me
      const userData = await authApi.getCurrentUser();
      setUser(userData);
      
      // Then get dashboard data (when backend implements /api/dashboard)
      try {
        const dashboardResponse = await dashboardApi.getDashboardData();
        setDashboardData(dashboardResponse);
      } catch (error) {
        // Dashboard endpoint might not be implemented yet, that's OK
        console.log('Dashboard API not yet implemented');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // AC4: Protected routes redirect unauthenticated users to OIDC sign-in
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSignOut = (): void => {
    // AC5: Sign out clears tokens and calls IDP end-session endpoint
    window.location.href = 'http://localhost:8080/logout';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Global UI: App header with product name, member name, and Sign out */}
      <header className="bg-white px-8 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Member Benefits Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user?.email}</span>
          <button 
            onClick={handleSignOut} 
            className="bg-red-600 hover:bg-red-700 text-white border-none py-2 px-4 rounded cursor-pointer transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </header>
      
      <main className="p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
        
        {/* AC1: Show active plan (name, network) and coverage period */}
        <div className="bg-white p-6 mb-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Plan</h3>
          {dashboardData?.activePlan ? (
            <div className="space-y-2">
              <p><strong className="text-gray-800">{dashboardData.activePlan.name}</strong></p>
              <p className="text-gray-600">Network: {dashboardData.activePlan.networkName}</p>
              <p className="text-gray-600">Coverage: {dashboardData.activePlan.planYear}</p>
            </div>
          ) : (
            <p className="text-gray-500">No active plan found</p>
          )}
        </div>

        {/* AC2: Show Deductible and OOP Max progress (used vs. limit) for in-network */}
        <div className="bg-white p-6 mb-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Accumulators</h3>
          {dashboardData?.accumulators ? (
            <div className="space-y-4">
              {dashboardData.accumulators.map((acc) => (
                <div key={acc.id} className="mb-4">
                  <p className="text-gray-700 mb-2">{acc.type}: ${acc.usedAmount} / ${acc.limitAmount}</p>
                  <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300 ease-out"
                      style={{ width: `${(acc.usedAmount / acc.limitAmount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No accumulator data available</p>
          )}
        </div>

        {/* AC3: Show Recent Claims (latest 5) with status and member responsibility */}
        <div className="bg-white p-6 mb-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Claims</h3>
          {dashboardData?.recentClaims && dashboardData.recentClaims.length > 0 ? (
            <div>
              <div className="space-y-2">
                {dashboardData.recentClaims.map((claim) => (
                  <div key={claim.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span className="text-gray-700">#{claim.claimNumber}</span>
                    <span className="text-gray-600">{claim.status}</span>
                    <span className="text-gray-700 font-medium">${claim.totalMemberResponsibility}</span>
                    {/* AC4: Clicking a recent claim opens Claim Detail */}
                    <button 
                      onClick={() => navigate(`/claims/${claim.claimNumber}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm transition-colors duration-200"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
              {/* AC5: View All Claims navigates to Claims List */}
              <button 
                onClick={() => navigate('/claims')} 
                className="bg-blue-600 hover:bg-blue-700 text-white border-none py-2 px-5 rounded cursor-pointer mt-4 transition-colors duration-200"
              >
                View All Claims
              </button>
            </div>
          ) : (
            <p className="text-gray-500">No recent claims found</p>
          )}
        </div>
      </main>
    </div>
  );
};


export default Dashboard;