import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Member } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  member: Member | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [member, setMember] = useState<Member | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
      try {
          setIsLoading(true);
          const [userData, memberData] = await Promise.all([
              authApi.getCurrentUser(),
              authApi.getCurrentMember()
          ]);
          setUser(userData);
          setMember(memberData);
      } catch (error) {
          setUser(null);
          setMember(null);
      } finally {
          setIsLoading(false);
      }
  };

    const login = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const logout = () => {
    window.location.href = 'http://localhost:8080/logout';
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    member,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth
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