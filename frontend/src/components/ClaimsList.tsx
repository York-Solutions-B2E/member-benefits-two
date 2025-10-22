import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ClaimsListRequest, ClaimsListResponse, ClaimSummaryDto } from '../types';
import { claimsApi } from '../services/api';
import Navigation from './Navigation';

const ClaimsList: React.FC = () => {
  const [claimsData, setClaimsData] = useState<ClaimsListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [providerFilter, setProviderFilter] = useState<string>('');
  const [claimNumberFilter, setClaimNumberFilter] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(10);

  // Available status options
  const statusOptions = [
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'IN_REVIEW', label: 'In Review' },
    { value: 'PROCESSED', label: 'Processed' },
    { value: 'PAID', label: 'Paid' },
    { value: 'DENIED', label: 'Denied' }
  ];

  // Load URL parameters on component mount
  useEffect(() => {
    const status = searchParams.get('status');
    const start = searchParams.get('startDate');
    const end = searchParams.get('endDate');
    const provider = searchParams.get('provider');
    const claimNumber = searchParams.get('claimNumber');
    const size = searchParams.get('size');

    if (status) setStatusFilter(status.split(','));
    if (start) setStartDate(start);
    if (end) setEndDate(end);
    if (provider) setProviderFilter(provider);
    if (claimNumber) setClaimNumberFilter(claimNumber);
    if (size) setPageSize(parseInt(size));
  }, [searchParams]);

  // Fetch claims data
  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const request: ClaimsListRequest = {
        status: statusFilter.length > 0 ? statusFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        provider: providerFilter || undefined,
        claimNumber: claimNumberFilter || undefined,
        page: parseInt(searchParams.get('page') || '0'),
        size: pageSize
      };

      const response = await claimsApi.getClaimsList(request);
      setClaimsData(response);
    } catch (err) {
      console.error('Error fetching claims:', err);
      setError('Failed to load claims. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, startDate, endDate, providerFilter, claimNumberFilter, searchParams, pageSize]);

  // Fetch data when filters change
  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  // Update URL parameters when filters change
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    
    if (statusFilter.length > 0) params.set('status', statusFilter.join(','));
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (providerFilter) params.set('provider', providerFilter);
    if (claimNumberFilter) params.set('claimNumber', claimNumberFilter);
    if (pageSize !== 10) params.set('size', pageSize.toString());
    
    setSearchParams(params);
  }, [statusFilter, startDate, endDate, providerFilter, claimNumberFilter, pageSize, setSearchParams]);

  // Handle search
  const handleSearch = () => {
    updateUrlParams();
    fetchClaims();
  };

  // Handle status filter change
  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setStatusFilter(prev => [...prev, status]);
    } else {
      setStatusFilter(prev => prev.filter(s => s !== status));
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    const params = new URLSearchParams(searchParams);
    params.set('size', newSize.toString());
    params.set('page', '0'); // Reset to first page
    setSearchParams(params);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  };

  // Handle claim row click
  const handleClaimClick = (claim: ClaimSummaryDto) => {
    navigate(`/claims/${claim.id}`);
  };

  // Handle logout
  const handleLogout = () => {
    navigate('/logout');
  };

  // Add this helper function
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const [expandedSections, setExpandedSections] = useState<{
    status: boolean;
    dateRange: boolean;
    provider: boolean;
    claimNumber: boolean;
  }>({
    status: true, // Start with status expanded by default
    dateRange: true,
    provider: true,
    claimNumber: true,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Use the new Navigation component */}
      <Navigation 
        pageTitle="Claims" 
        showBreadcrumb={true}
      />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Sidebar Layout */}
        <div className="flex gap-6">
          
          {/* Left Sidebar - Filters */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>

              <div className="space-y-6">
                {/* Status Filter */}
                <div className="rounded-lg">
                  <button
                    onClick={() => toggleSection('status')}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Status</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {statusFilter.length}
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        expandedSections.status ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedSections.status && (
                    <div className="px-4 pb-4">
                      <div className="space-y-2">
                        {statusOptions.map(option => (
                          <label key={option.value} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={statusFilter.includes(option.value)}
                              onChange={(e) => handleStatusChange(option.value, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>


                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Date Range
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        placeholder="Start Date"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        placeholder="End Date"
                      />
                    </div>
                  </div>
                </div>

                {/* Provider Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Provider
                  </label>
                  <input
                    type="text"
                    value={providerFilter}
                    onChange={(e) => setProviderFilter(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    placeholder="Search provider..."
                  />
                </div>

                {/* Claim Number Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Claim #
                  </label>
                  <input
                    type="text"
                    value={claimNumberFilter}
                    onChange={(e) => setClaimNumberFilter(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    placeholder="Enter claim number..."
                  />
                </div>

              {/* Clear Filters */}
                <button
                  onClick={() => {
                    setStatusFilter([]);
                    setStartDate('');
                    setEndDate('');
                    setProviderFilter('');
                    setClaimNumberFilter('');
                  }}
                  className="w-full bg-gray-100 text-gray-700 px-2 py-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Claims Table */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Claims</h2>
                      <p className="text-sm text-gray-600">
                        {claimsData ? `${claimsData.totalElements} total claims` : 'Loading...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Content */}
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading claims...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={fetchClaims}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              ) : claimsData && claimsData.content.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Claim #
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service Dates
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Provider
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Member Responsibility
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {claimsData.content.map((claim) => (
                          <tr
                            key={claim.id}
                            onClick={() => handleClaimClick(claim)}
                            className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{claim.claimNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(claim.serviceStartDate)}
                              {claim.serviceStartDate !== claim.serviceEndDate && (
                                <span>–{formatDate(claim.serviceEndDate)}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {claim.provider?.name || 'Unknown Provider'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                claim.status === 'PAID' ? 'bg-gray-100 text-gray-800' :
                                claim.status === 'PROCESSED' ? 'bg-blue-100 text-blue-800' :
                                claim.status === 'DENIED' ? 'bg-red-100 text-red-800' :
                                claim.status === 'IN_REVIEW' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {claim.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(claim.totalMemberResponsibility)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                              View ▸
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(claimsData.pageNumber - 1)}
                        disabled={claimsData.first}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(claimsData.pageNumber + 1)}
                        disabled={claimsData.last}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Page <span className="font-medium">{claimsData.pageNumber + 1}</span> of{' '}
                          <span className="font-medium">{claimsData.totalPages}</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <label className="text-sm text-gray-700 mr-2">Per page:</label>
                          <select
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                            className="rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                          </select>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handlePageChange(claimsData.pageNumber - 1)}
                            disabled={claimsData.first}
                            className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ◂ Prev
                          </button>
                          <button
                            onClick={() => handlePageChange(claimsData.pageNumber + 1)}
                            disabled={claimsData.last}
                            className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next ▸
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No claims found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimsList;
