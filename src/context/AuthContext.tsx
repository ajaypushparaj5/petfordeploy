
import React, { createContext, useContext, useState, useEffect } from 'react';
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

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@gmail.com',
    password: 'password',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@gmail.com',
    password: 'password',
    profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '3',
    name: 'Ajay',
    email: 'ajay@gmail.com',
    password: 'password',
    profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '4',
    name: 'akash',
    email: 'akash@gmail.com',
    password: 'password',
    profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '5',
    name: 'Ajaz',
    email: 'ajaz@gmail.com',
    password: 'password',
    profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '6',
    name: 'Daleesha',
    email: 'daleesha@gmail.com',
    password: 'password',
    profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in localStorage (simulating persistent sessions)
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

  const login = (email: string, password: string) => {
    // Mock login logic
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Remove password before storing user
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      toast({
        title: "Success",
        description: "You've been logged in successfully!",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Try the demo account: john@example.com / password",
        variant: "destructive",
      });
    }
  };

  const signup = (name: string, email: string, password: string) => {
    // Mock signup logic
    const userExists = MOCK_USERS.some(u => u.email === email);
    
    if (userExists) {
      toast({
        title: "Signup failed",
        description: "An account with this email already exists.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new user (in a real app, this would be sent to an API)
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FFD700&color=000`,
    };
    
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    toast({
      title: "Account created",
      description: "Your account has been created successfully!",
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logged out",
      description: "You've been logged out successfully.",
    });
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
