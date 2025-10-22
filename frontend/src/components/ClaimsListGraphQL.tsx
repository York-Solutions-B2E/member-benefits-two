import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_CLAIMS } from '../graphql/queries';

// Types
interface Claim {
    id: string;
    claimNumber: string;
    status: string;
    serviceStartDate: string;
    serviceEndDate: string;
    totalMemberResponsibility: number;
    provider?: {
        id: string;
        name: string;
        specialty: string;
    };
}

interface ClaimsData {
    claims: {
        edges: Array<{
            node: Claim;
            cursor: string;
        }>;
        totalCount: number;
        pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string;
            endCursor: string;
        };
    };
}

const ClaimsListGraphQL: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [providerFilter, setProviderFilter] = useState<string>('');
  const [claimNumberFilter, setClaimNumberFilter] = useState<string>('');
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [pageSize] = useState<number>(10);

  const { data, loading, error, refetch } = useQuery<ClaimsData>(GET_CLAIMS, {
    variables: {
      filters: {
        status: statusFilter.length > 0 ? statusFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        provider: providerFilter || undefined,
        claimNumber: claimNumberFilter || undefined,
      },
      pagination: {
        first: pageSize,
        after: currentCursor,
      }
    }
  });

  const handleFilterChange = () => {
    setCurrentCursor(null);
    refetch();
  };

  const handleNextPage = () => {
    if (data?.claims?.pageInfo?.hasNextPage) {
      setCurrentCursor(data.claims.pageInfo.endCursor);
    }
  };

  const handlePreviousPage = () => {
    if (data?.claims?.pageInfo?.hasPreviousPage) {
      setCurrentCursor(data.claims.pageInfo.startCursor);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-600 p-4">Error: {error.message}</div>;

  const claims = data?.claims?.edges?.map((edge) => edge.node) || [];
  const totalCount = data?.claims?.totalCount || 0;
  const pageInfo = data?.claims?.pageInfo;

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Filter Claims</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              multiple
              value={statusFilter}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setStatusFilter(values);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="SUBMITTED">Submitted</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="PROCESSED">Processed</option>
              <option value="PAID">Paid</option>
              <option value="DENIED">Denied</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider
            </label>
            <input
              type="text"
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              placeholder="Search by provider name"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Claim Number
            </label>
            <input
              type="text"
              value={claimNumberFilter}
              onChange={(e) => setClaimNumberFilter(e.target.value)}
              placeholder="Search by claim number"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleFilterChange}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Claims ({totalCount})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Claim Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Responsibility
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.map((claim: any) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {claim.claimNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      claim.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      claim.status === 'DENIED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {claim.serviceStartDate} - {claim.serviceEndDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {claim.provider?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${claim.totalMemberResponsibility?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePreviousPage}
              disabled={!pageInfo?.hasPreviousPage}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={!pageInfo?.hasNextPage}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{claims.length}</span> of{' '}
                <span className="font-medium">{totalCount}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={handlePreviousPage}
                  disabled={!pageInfo?.hasPreviousPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={!pageInfo?.hasNextPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimsListGraphQL;