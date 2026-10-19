import React, { createContext, useContext, useState, useEffect } from 'react';

export type DashboardRole = 'OWNER' | 'OPS' | 'EMPLOYEE' | 'ACCOUNTANT';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: DashboardRole;
  businessName: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (email: string, password?: string) => boolean;
  signup: (data: { name: string; email: string; businessName: string }) => boolean;
  logout: () => void;
  switchBusiness: (newBusinessName: string) => void;
  switchRole: (role: DashboardRole) => void;
  setDemoPersona: (role: 'OWNER' | 'OPS' | 'EMPLOYEE') => void;
}

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr-ravi-001',
  name: 'Ravi',
  email: 'ravi.owner@grownova.in',
  role: 'OWNER',
  businessName: 'Shree Ganesh Textiles',
  avatarUrl: '/ravi_avatar_hq.jpg',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('grownova_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_DEMO_USER;
      }
    }
    // Default to Ravi owner for instant frictionless evaluation of the dashboard
    return DEFAULT_DEMO_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('grownova_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('grownova_auth_user');
    }
  }, [user]);

  const login = (email: string, _password?: string): boolean => {
    const demoUser: UserProfile = {
      id: 'usr-ravi-001',
      name: email.toLowerCase().includes('taksh') ? 'Taksh' : 'Ravi',
      email: email.trim(),
      role: 'OWNER',
      businessName: 'Shree Ganesh Textiles',
      avatarUrl: '/ravi_avatar_hq.jpg',
    };
    setUser(demoUser);
    return true;
  };

  const signup = (data: { name: string; email: string; businessName: string }): boolean => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: data.name.trim() || 'Ravi',
      email: data.email.trim(),
      role: 'OWNER',
      businessName: data.businessName.trim() || 'GrowNova Enterprise',
      avatarUrl: '/ravi_avatar_hq.jpg',
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchBusiness = (newBusinessName: string) => {
    if (user) {
      setUser({ ...user, businessName: newBusinessName });
    }
  };

  const switchRole = (newRole: DashboardRole) => {
    if (user) {
      const name = newRole === 'OPS' ? 'manager' : newRole === 'EMPLOYEE' ? 'employee' : 'owner';
      setUser({ ...user, role: newRole, name });
    } else {
      setDemoPersona(newRole === 'OPS' ? 'OPS' : newRole === 'EMPLOYEE' ? 'EMPLOYEE' : 'OWNER');
    }
  };

  const setDemoPersona = (role: 'OWNER' | 'OPS' | 'EMPLOYEE') => {
    if (role === 'OPS') {
      setUser({
        id: 'usr-ops-002',
        name: 'manager',
        email: 'manager.ops@grownova.in',
        role: 'OPS',
        businessName: 'Shree Ganesh Textiles',
        avatarUrl: '/ravi_avatar_hq.jpg',
      });
    } else if (role === 'EMPLOYEE') {
      setUser({
        id: 'usr-emp-003',
        name: 'employee',
        email: 'employee@grownova.in',
        role: 'EMPLOYEE',
        businessName: 'Shree Ganesh Textiles',
        avatarUrl: '/ravi_avatar_hq.jpg',
      });
    } else {
      setUser({
        id: 'usr-owner-001',
        name: 'owner',
        email: 'owner@grownova.in',
        role: 'OWNER',
        businessName: 'Shree Ganesh Textiles',
        avatarUrl: '/ravi_avatar_hq.jpg',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isDemoMode: true,
        login,
        signup,
        logout,
        switchBusiness,
        switchRole,
        setDemoPersona,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
