import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClaimDetail as ClaimDetailType } from '../types';
import { claimsApi, downloadEob } from '../services/api';
import Navigation from './Navigation';

const ClaimDetail: React.FC = () => {
  const [claimDetail, setClaimDetail] = useState<ClaimDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { claimId } = useParams<{ claimId: string }>();
  const navigate = useNavigate();

  // Mock data for development - replace with API call later
  const getMockClaimDetail = (): ClaimDetailType => ({
    id: claimId || '1',
    claimNumber: 'C-10421',
    status: 'PROCESSED',
    serviceStartDate: '2024-08-29',
    serviceEndDate: '2024-08-29',
    provider: {
      id: '1',
      name: 'River Clinic',
      specialty: 'Primary Care'
    },
    totalBilled: 300.00,
    totalAllowed: 200.00,
    totalPlanPaid: 155.00,
    totalMemberResponsibility: 45.00,
    lines: [
      {
        id: '1',
        lineNumber: 1,
        cptCode: '99213',
        description: 'Office Visit, Est Pt',
        billedAmount: 150.00,
        allowedAmount: 100.00,
        deductibleApplied: 0,
        copayApplied: 25.00,
        coinsuranceApplied: 10.00,
        planPaid: 65.00,
        memberResponsibility: 35.00
      },
      {
        id: '2',
        lineNumber: 2,
        cptCode: '81002',
        description: 'Urinalysis',
        billedAmount: 150.00,
        allowedAmount: 100.00,
        deductibleApplied: 0,
        copayApplied: 0,
        coinsuranceApplied: 10.00,
        planPaid: 90.00,
        memberResponsibility: 10.00
      }
    ],
    statusHistory: [
      {
        id: '1',
        status: 'SUBMITTED',
        occurredAt: '2024-08-29T10:00:00Z',
        note: 'Claim submitted by provider'
      },
      {
        id: '2',
        status: 'IN_REVIEW',
        occurredAt: '2024-08-30T14:30:00Z',
        note: 'Claim under review'
      },
      {
        id: '3',
        status: 'PROCESSED',
        occurredAt: '2024-09-02T09:15:00Z',
        note: 'Claim processed and approved'
      },
      {
        id: '4',
        status: 'PAID',
        occurredAt: '2024-09-03T11:45:00Z',
        note: 'Payment issued to provider'
      }
    ]
  });

  useEffect(() => {
    const fetchClaimDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get real claim detail from API
        if (claimId) {
          try {
            const response = await claimsApi.getClaimDetail(claimId);
            setClaimDetail(response);
            console.log('Claim detail loaded from API:', response);
          } catch (apiError) {
            console.error('Failed to fetch claim detail from API, using mock data:', apiError);
            setError('Failed to load claim details. Please try again.');
          }
        }
        
      } catch (err) {
        console.error('Error fetching claim detail:', err);
        setError('Failed to load claim details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (claimId) {
      fetchClaimDetail();
    }
  }, [claimId]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'PROCESSED': return 'bg-blue-100 text-blue-800';
      case 'IN_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'DENIED': return 'bg-red-100 text-red-800';
      case 'SUBMITTED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBackToClaims = () => {
    // TODO: Preserve filters when navigating back
    navigate('/claims');
  };

  const handleDownloadEOB = async () => {
    if (!claimDetail) return;

    try {
      const blob = await downloadEob(claimDetail.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `EOB_${claimDetail.claimNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading EOB:', error);
    }
    console.log('Download EOB for claim:', claimDetail?.claimNumber);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-lg">Loading claim details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!claimDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Claim not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Use the new Navigation component */}
      <Navigation 
        pageTitle="Claim Detail"
        showBreadcrumb={true}
      />

      <main className="p-6 max-w-7xl mx-auto">
        {/* Claim Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Claim #{claimDetail.claimNumber}
              </h2>
              <div className="mt-2 flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(claimDetail.status)}`}>
                  {claimDetail.status.replace('_', ' ')}
                </span>
                <span className="text-gray-600">
                  Service: {formatDate(claimDetail.serviceStartDate)}
                  {claimDetail.serviceStartDate !== claimDetail.serviceEndDate && 
                    `–${formatDate(claimDetail.serviceEndDate)}`
                  }
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Provider</p>
              <p className="font-medium text-gray-900">{claimDetail.provider.name}</p>
              <p className="text-sm text-gray-600">{claimDetail.provider.specialty}</p>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h3>
            <div className="flex items-center space-x-4 overflow-x-auto">
              {claimDetail.statusHistory.map((event, index) => (
                <div key={event.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      index <= claimDetail.statusHistory.findIndex(e => e.status === claimDetail.status) 
                        ? 'bg-blue-600' : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-xs mt-1 ${
                      index <= claimDetail.statusHistory.findIndex(e => e.status === claimDetail.status)
                        ? 'text-blue-600 font-medium' : 'text-gray-500'
                    }`}>
                      {event.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {formatDateTime(event.occurredAt)}
                    </span>
                  </div>
                  {index < claimDetail.statusHistory.length - 1 && (
                    <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Billed</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(claimDetail.totalBilled)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Allowed Amount</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(claimDetail.totalAllowed)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Plan Paid</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(claimDetail.totalPlanPaid)}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 mb-1">Member Responsibility</p>
              <p className="text-xl font-semibold text-blue-900">
                {formatCurrency(claimDetail.totalMemberResponsibility)}
              </p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Line Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPT
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Billed
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allowed
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ded
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Copay
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coins
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan Paid
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    You Pay
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {claimDetail.lines.map((line) => (
                  <tr key={line.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {line.cptCode}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {line.description}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(line.billedAmount)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(line.allowedAmount)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(line.deductibleApplied)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(line.copayApplied)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(line.coinsuranceApplied)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(line.planPaid)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(line.memberResponsibility)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBackToClaims}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            ← Back to Claims
          </button>
          
          <button
            onClick={handleDownloadEOB}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Download EOB PDF
          </button>
        </div>
      </main>
    </div>
  );
};

export default ClaimDetail;
