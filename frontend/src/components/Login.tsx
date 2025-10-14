import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async (): Promise<void> => {
    setLoading(true);
    setError('');
    
    try {
      // AC1: Start OIDC Authorization Code Flow - no email/password fields
      // Redirect to your backend's OAuth2 endpoint
      window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    } catch (err) {
      // AC3: Show non-blocking inline message and allow retry
      setError('Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Member Benefits Dashboard</h1>
        
        {/* AC1: "Continue with Google" action that starts OIDC Authorization Code Flow */}
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          style={styles.googleButton}
        >
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>
        
        {/* AC3: On authentication error, show a non-blocking inline message */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

interface Styles {
  container: React.CSSProperties;
  card: React.CSSProperties;
  title: React.CSSProperties;
  googleButton: React.CSSProperties;
  error: React.CSSProperties;
}

const styles: Styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    minWidth: '300px'
  },
  title: {
    marginBottom: '2rem',
    color: '#333',
    fontSize: '1.5rem'
  },
  googleButton: {
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '1rem'
  },
  error: {
    color: '#d32f2f',
    fontSize: '14px',
    marginTop: '1rem'
  }
};

export default Login;