'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  user: { name: string; email: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();

  // Hardcoded credentials
  const FAKE_USER = { name: 'Dr. Evans', email: 'doctor.evans@hospital.com', password: 'password' };

  const login = (email: string, pass: string): boolean => {
    if (email === FAKE_USER.email && pass === FAKE_USER.password) {
      setIsAuthenticated(true);
      setUser({ name: FAKE_USER.name, email: FAKE_USER.email });
      router.push('/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  const value = { isAuthenticated, login, logout, user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
