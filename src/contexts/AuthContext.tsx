import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthToken, removeAuthToken, setAuthToken } from '@/lib/graphql/client';
import { useGetMe } from '@/hooks/api/useAuth';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = getAuthToken();
  
  // Fetch user data from backend if token exists
  const { user: fetchedUser, loading: userLoading, refetch: refetchUserData } = useGetMe(
    !token // Skip query if no token
  );

  useEffect(() => {
    if (token) {
      // If we have a token but no user data yet, wait for the query
      if (userLoading) {
        setIsLoading(true);
      } else if (fetchedUser) {
        setUser(fetchedUser);
        setIsLoading(false);
      } else {
        // Token exists but no user data - user might be logged out
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [token, fetchedUser, userLoading]);

  const login = (newToken: string, userData: User) => {
    setAuthToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const refetchUser = async () => {
    await refetchUserData();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
