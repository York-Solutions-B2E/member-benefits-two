import React, { useState } from 'react';

const Login: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center min-w-[300px]">
        <h1 className="mb-8 text-gray-800 text-2xl font-semibold">
          Member Benefits Dashboard
        </h1>
        
        {/* AC1: "Continue with Google" action that starts OIDC Authorization Code Flow */}
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white border-none py-3 px-6 rounded text-base cursor-pointer w-full mb-4 transition-colors duration-200"
        >
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>
        
        {/* AC3: On authentication error, show a non-blocking inline message */}
        {error && (
          <div className="text-red-600 text-sm mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};


export default Login;