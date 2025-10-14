import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, DashboardData } from '../types';
import { authApi, dashboardApi } from '../services/api';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (): Promise<void> => {
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
  };

  const handleSignOut = (): void => {
    // AC5: Sign out clears tokens and calls IDP end-session endpoint
    window.location.href = 'http://localhost:8080/logout';
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Global UI: App header with product name, member name, and Sign out */}
      <header style={styles.header}>
        <h1>Member Benefits Dashboard</h1>
        <div style={styles.userInfo}>
          <span>Welcome, {user?.email}</span>
          <button onClick={handleSignOut} style={styles.signOutButton}>
            Sign Out
          </button>
        </div>
      </header>
      
      <main style={styles.main}>
        <h2>Dashboard</h2>
        
        {/* AC1: Show active plan (name, network) and coverage period */}
        <div style={styles.section}>
          <h3>Active Plan</h3>
          {dashboardData?.activePlan ? (
            <div>
              <p><strong>{dashboardData.activePlan.name}</strong></p>
              <p>Network: {dashboardData.activePlan.networkName}</p>
              <p>Coverage: {dashboardData.activePlan.planYear}</p>
            </div>
          ) : (
            <p>No active plan found</p>
          )}
        </div>

        {/* AC2: Show Deductible and OOP Max progress (used vs. limit) for in-network */}
        <div style={styles.section}>
          <h3>Accumulators</h3>
          {dashboardData?.accumulators ? (
            <div>
              {dashboardData.accumulators.map((acc) => (
                <div key={acc.id} style={styles.accumulator}>
                  <p>{acc.type}: ${acc.usedAmount} / ${acc.limitAmount}</p>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        width: `${(acc.usedAmount / acc.limitAmount) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No accumulator data available</p>
          )}
        </div>

        {/* AC3: Show Recent Claims (latest 5) with status and member responsibility */}
        <div style={styles.section}>
          <h3>Recent Claims</h3>
          {dashboardData?.recentClaims && dashboardData.recentClaims.length > 0 ? (
            <div>
              {dashboardData.recentClaims.map((claim) => (
                <div key={claim.id} style={styles.claimItem}>
                  <span>#{claim.claimNumber}</span>
                  <span>{claim.status}</span>
                  <span>${claim.totalMemberResponsibility}</span>
                  {/* AC4: Clicking a recent claim opens Claim Detail */}
                  <button onClick={() => navigate(`/claims/${claim.claimNumber}`)}>
                    View
                  </button>
                </div>
              ))}
              {/* AC5: View All Claims navigates to Claims List */}
              <button onClick={() => navigate('/claims')} style={styles.viewAllButton}>
                View All Claims
              </button>
            </div>
          ) : (
            <p>No recent claims found</p>
          )}
        </div>
      </main>
    </div>
  );
};

interface Styles {
  container: React.CSSProperties;
  header: React.CSSProperties;
  userInfo: React.CSSProperties;
  signOutButton: React.CSSProperties;
  main: React.CSSProperties;
  section: React.CSSProperties;
  loading: React.CSSProperties;
  accumulator: React.CSSProperties;
  progressBar: React.CSSProperties;
  progressFill: React.CSSProperties;
  claimItem: React.CSSProperties;
  viewAllButton: React.CSSProperties;
}

const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: 'white',
    padding: '1rem 2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  signOutButton: {
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  main: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  section: {
    backgroundColor: 'white',
    padding: '1.5rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px'
  },
  accumulator: {
    marginBottom: '1rem'
  },
  progressBar: {
    width: '100%',
    height: '20px',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4285f4',
    transition: 'width 0.3s ease'
  },
  claimItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee'
  },
  viewAllButton: {
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem'
  }
};

export default Dashboard;