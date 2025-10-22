import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, DashboardData, AccumulatorSummaryDto, ClaimSummaryDto, PlanSummaryDto } from '../types';
import { authApi, dashboardApi } from '../services/api';
import Navigation from './Navigation';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  const fetchDashboardData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Get dashboard data from API only
      const dashboardResponse = await dashboardApi.getDashboardData();
      setDashboardData(dashboardResponse);
      console.log('Dashboard data loaded from API:', dashboardResponse);
    } catch (error) {
      console.error('Failed to fetch dashboard data from API:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          pageTitle="Dashboard" 
          displayName={user?.email || 'User'}
          showBreadcrumb={false}
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Use the new Navigation component */}
      <Navigation 
        pageTitle="Dashboard" 
        displayName={user?.email || 'User'}
        showBreadcrumb={false}
      />
      
      <main className="p-6 max-w-7xl mx-auto space-y-8">
      
        {/* Active Plan */}
        {dashboardData?.activePlan && (
          <div className="bg-gradient-to-r from-stone-600 via-stone-400 to-stone-200 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{dashboardData.activePlan.name}</h2>
                  <p className="text-blue-100">{dashboardData.activePlan.networkName} • {dashboardData.activePlan.planYear}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-black">Active Plan</p>
                <p className="text-lg font-semibold text-black">{dashboardData.activePlan.type}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Accumulators Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-tr from-blue-500 via-blue-200 to-emerald-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Accumulators</h2>
                  <p className="text-sm text-gray-600">Track your deductible and out-of-pocket spending</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {dashboardData?.inNetworkAccumulators && dashboardData.inNetworkAccumulators.length > 0 ? (
                <div className="space-y-6">
                  {dashboardData.inNetworkAccumulators.map((acc: AccumulatorSummaryDto) => (
                    <div key={`${acc.type}-${acc.tier}`} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${acc.type === 'DEDUCTIBLE' ? 'bg-stone-600' : 'bg-stone-500'}`}></div>
                          <span className="font-medium text-gray-900">
                            {acc.type === 'DEDUCTIBLE' ? 'Deductible' : 'Out-of-Pocket Maximum'}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {formatCurrency(acc.usedAmount)} / {formatCurrency(acc.limitAmount)}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ease-out ${
                              acc.type === 'DEDUCTIBLE' ? 'bg-gradient-to-r from-stone-700 to-stone-500' : 'bg-gradient-to-r from-stone-600 to-stone-400'
                            }`}
                            style={{ width: `${Math.min((acc.usedAmount / acc.limitAmount) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{Math.round((acc.usedAmount / acc.limitAmount) * 100)}% used</span>
                          <span>{formatCurrency(acc.limitAmount - acc.usedAmount)} remaining</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No accumulator data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Claims Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-tr from-blue-500 via-blue-200 to-emerald-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Recent Claims</h2>
                    <p className="text-sm text-gray-600">Your latest claim activity</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/claims')} 
                  className="text-black hover:text-black text-sm font-medium"
                >
                  View All →
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {dashboardData?.recentClaims && dashboardData.recentClaims.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentClaims.map((claim, index) => (
                    <div key={claim.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center ">
                          <span className="text-sm font-semibold text-gray-600">#{claim.claimNumber.slice(-4)}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">Claim #{claim.claimNumber}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                              {claim.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(claim.serviceStartDate).toLocaleDateString()} • {claim.provider?.name || 'Provider'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(claim.totalMemberResponsibility)}</p>
                        <button 
                          onClick={() => navigate(`/claims/${claim.id}`)}
                          className="text-black hover:text-slate-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No recent claims found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;