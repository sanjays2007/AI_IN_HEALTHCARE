'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'patient' | 'doctor' | 'nurse' | 'finance' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string, role: UserRole) => boolean;
  register: (userData: Omit<User, 'id'> & { password: string }) => boolean;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS: (User & { password: string })[] = [
  { id: '1', name: 'Dr. Evans', email: 'doctor.evans@hospital.com', password: 'password', role: 'doctor' },
  { id: '2', name: 'Nurse Smith', email: 'nurse.smith@hospital.com', password: 'password', role: 'nurse' },
  { id: '3', name: 'John Patient', email: 'patient@example.com', password: 'password', role: 'patient' },
  { id: '4', name: 'Finance Manager', email: 'finance@hospital.com', password: 'password', role: 'finance' },
  { id: '5', name: 'Admin User', email: 'admin@hospital.com', password: 'password', role: 'admin' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<(User & { password: string })[]>(MOCK_USERS);
  const router = useRouter();

  // Simulate initial auth check
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const login = (email: string, pass: string, role: UserRole): boolean => {
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass && u.role === role
    );
    
    if (foundUser) {
      setIsAuthenticated(true);
      setUser({ id: foundUser.id, name: foundUser.name, email: foundUser.email, role: foundUser.role });
      
      // Route based on role
      switch (role) {
        case 'patient':
          router.push('/patient/dashboard');
          break;
        case 'doctor':
          router.push('/doctor/dashboard');
          break;
        case 'admin':
          router.push('/admin');
          break;
        default:
          router.push('/dashboard');
      }
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, 'id'> & { password: string }): boolean => {
    // Check if email already exists
    const existingUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    );
    
    if (existingUser) {
      return false;
    }

    const newUser: User & { password: string } = {
      ...userData,
      id: String(registeredUsers.length + 1),
    };

    setRegisteredUsers([...registeredUsers, newUser]);
    setIsAuthenticated(true);
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });
    
    // Route based on role
    switch (userData.role) {
      case 'patient':
        router.push('/patient/dashboard');
        break;
      case 'doctor':
        router.push('/doctor/dashboard');
        break;
      case 'admin':
        router.push('/admin');
        break;
      default:
        router.push('/dashboard');
    }
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  const value = { isAuthenticated, isLoading, login, register, logout, user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
