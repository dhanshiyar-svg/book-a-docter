import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Doctor } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  currentUser: User | null;
  currentDoctor: Doctor | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, role?: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  switchRoleDemo: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Patient Dhana S. for instant out-of-the-box exploration
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'user-patient-1',
    name: 'Dhana S.',
    email: 'dhanshiyar@gmail.com',
    role: 'patient',
    phone: '+1 (555) 234-5678',
    dob: '1992-05-14',
    gender: 'Female',
    bloodGroup: 'O+',
    emergencyContact: 'Rajesh S. (+1 555-890-1234)',
    createdAt: '2025-10-15T08:00:00.000Z',
  });
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [token, setToken] = useState<string | null>('demo_jwt_token_patient');
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, role?: string) => {
    setIsLoading(true);
    try {
      const data = await api.login(email, role);
      if (data.success) {
        setCurrentUser(data.user);
        setCurrentDoctor(data.doctor || null);
        setToken(data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: any) => {
    setIsLoading(true);
    try {
      const data = await api.register(formData);
      if (data.success) {
        setCurrentUser(data.user);
        setCurrentDoctor(data.doctor || null);
        setToken(data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Register error', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentDoctor(null);
    setToken(null);
  };

  const switchRoleDemo = async (role: UserRole) => {
    if (role === 'patient') {
      await login('dhanshiyar@gmail.com', 'patient');
    } else if (role === 'doctor') {
      await login('dr.mercer@medibook.health', 'doctor');
    } else if (role === 'admin') {
      await login('admin@medibook.health', 'admin');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentDoctor,
        token,
        isLoading,
        login,
        register,
        logout,
        switchRoleDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
