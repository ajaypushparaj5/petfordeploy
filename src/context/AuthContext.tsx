// ✅ Updated AuthContext.js - MySQL Integrated
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/api';
import { User } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        setCurrentUser(userObj);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/users/login', { email, password });
      const user = res.data;
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast({ title: 'Success', description: "You've been logged in successfully!" });
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.error || 'An error occurred during login',
        variant: 'destructive',
      });
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      await api.post('/users/signup', {
        name,
        email,
        password,
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FFD700&color=000`
      });
      toast({ title: 'Account created', description: 'Your account has been created successfully!' });
    } catch (error: any) {
      toast({
        title: 'Signup failed',
        description: error.response?.data?.error || 'An error occurred during signup',
        variant: 'destructive',
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast({ title: 'Logged out', description: "You've been logged out successfully." });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
