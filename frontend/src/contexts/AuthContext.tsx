import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';
import TokenStorage from '../services/tokenStorage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            setIsLoading(true);
            const userData = await authApi.getCurrentUser();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const logout = async () => {
    try {
      // Clear tokens from storage
      TokenStorage.clearTokens();
      
      // Call backend logout endpoint
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Redirect to login page
      window.location.href = 'http://localhost:8080/logout';
    }
  };

  const refreshTokens = async (): Promise<boolean> => {
    try {
      const refreshToken = TokenStorage.getRefreshToken();
      if (!refreshToken) {
        return false;
      }
      
      const response = await authApi.refreshToken();
      
      if (response.success) {
        // Token refresh successful
        return true;
      } else {
        // Token refresh failed
        TokenStorage.clearTokens();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      TokenStorage.clearTokens();
      return false;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
    refreshTokens
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};