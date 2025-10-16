import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, DashboardData, AccumulatorSummaryDto, ClaimSummaryDto, PlanSummaryDto } from '../types';
import { authApi, dashboardApi } from '../services/api';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Mock data for development
  const getMockDashboardData = (): DashboardData => ({
    activePlan: {
      id: "1",
      name: "Gold PPO",
      type: "PPO",
      networkName: "Prime",
      planYear: 2025
    },
    inNetworkAccumulators: [
      {
        type: "DEDUCTIBLE",
        tier: "IN_NETWORK",
        limitAmount: 1500,
        usedAmount: 300,
        remainingAmount: 1200
      },
      {
        type: "OOP_MAX",
        tier: "IN_NETWORK", 
        limitAmount: 6000,
        usedAmount: 1200,
        remainingAmount: 4800
      }
    ],
    recentClaims: [
      {
        id: "1",
        claimNumber: "C-10421",
        status: "PROCESSED",
        serviceStartDate: "2024-08-29",
        serviceEndDate: "2024-08-29",
        totalMemberResponsibility: 45,
        provider: {
          id: "1",
          name: "River Clinic",
          specialty: "Primary Care"
        }
      },
      {
        id: "2", 
        claimNumber: "C-10405",
        status: "DENIED",
        serviceStartDate: "2024-08-15",
        serviceEndDate: "2024-08-15",
        totalMemberResponsibility: 0,
        provider: {
          id: "2",
          name: "City Imaging Center", 
          specialty: "Radiology"
        }
      },
      {
        id: "3",
        claimNumber: "C-10398", 
        status: "PAID",
        serviceStartDate: "2024-08-01",
        serviceEndDate: "2024-08-01",
        totalMemberResponsibility: 120,
        provider: {
          id: "3",
          name: "Prime Hospital",
          specialty: "Hospital"
        }
      },
      {
        id: "4",
        claimNumber: "C-10375",
        status: "IN_REVIEW", 
        serviceStartDate: "2024-07-25",
        serviceEndDate: "2024-07-25",
        totalMemberResponsibility: 0,
        provider: {
          id: "1",
          name: "River Clinic",
          specialty: "Primary Care"
        }
      },
      {
        id: "5",
        claimNumber: "C-10312",
        status: "PAID",
        serviceStartDate: "2024-07-15", 
        serviceEndDate: "2024-07-15",
        totalMemberResponsibility: 60,
        provider: {
          id: "2",
          name: "City Imaging Center",
          specialty: "Radiology"
        }
      }
    ]
  });

  const fetchDashboardData = useCallback(async (): Promise<void> => {
    try {
      // First get user data from /api/auth/me
      const userData = await authApi.getCurrentUser();
      setUser(userData);
      
      // Force member creation by calling /api/auth/member
      try {
        await authApi.getCurrentMember();
        console.log('Member record created/retrieved');
      } catch (error) {
        console.error('Failed to create/retrieve member:', error);
      }
      
      // For now, use mock data instead of API call
      // TODO: Replace with real API call when backend is ready
      const mockData = getMockDashboardData();
      setDashboardData(mockData);
      console.log('Dashboard data loaded (mock):', mockData);
      
      // Uncomment this when backend is ready:
      // const dashboardResponse = await dashboardApi.getDashboardData();
      // setDashboardData(dashboardResponse);
      // console.log('Dashboard data loaded:', dashboardResponse);
      
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSignOut = (): void => {
    window.location.href = 'http://localhost:8080/logout';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'PROCESSED': return 'bg-blue-100 text-blue-800';
      case 'IN_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'DENIED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header matching the mockup */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">John Smith</span>
            <button 
              onClick={handleSignOut} 
              className="text-gray-600 hover:text-gray-800 text-sm underline"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      
      <main className="p-6 max-w-7xl mx-auto">
        {/* Three-column layout matching the mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Plan Column */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Plan</h2>
            {dashboardData?.activePlan ? (
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">•</span>
                  <span className="font-medium text-gray-900">{dashboardData.activePlan.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">•</span>
                  <span className="text-gray-600">Network: {dashboardData.activePlan.networkName}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">•</span>
                  <span className="text-gray-600">Coverage {dashboardData.activePlan.planYear}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No active plan found</p>
            )}
          </div>

          {/* Accumulators Column */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Accumulators</h2>
            {dashboardData?.inNetworkAccumulators && dashboardData.inNetworkAccumulators.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.inNetworkAccumulators.map((acc: AccumulatorSummaryDto) => (
                  <div key={`${acc.type}-${acc.tier}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {acc.type === 'DEDUCTIBLE' ? 'Deductible:' : 'OOP Max:'}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatCurrency(acc.usedAmount)} / {formatCurrency(acc.limitAmount)}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300 ease-out"
                        style={{ width: `${Math.min((acc.usedAmount / acc.limitAmount) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No accumulator data available</p>
            )}
          </div>

          {/* Recent Claims Column */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Claims</h2>
            {dashboardData?.recentClaims && dashboardData.recentClaims.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentClaims.map((claim) => (
                  <div key={claim.id} className="flex justify-between items-center py-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">#{claim.claimNumber}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(claim.status)}`}>
                          {claim.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(claim.totalMemberResponsibility)}
                      </span>
                      <button 
                        onClick={() => navigate(`/claims/${claim.claimNumber}`)}
                        className="text-blue-600 hover:text-blue-800 text-xs underline"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent claims found</p>
            )}
          </div>
        </div>

        {/* View All Claims Button */}
        <div className="mt-6">
          <button 
            onClick={() => navigate('/claims')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            View All Claims
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
