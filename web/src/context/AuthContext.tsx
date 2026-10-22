import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient, tokenStorage, ApiError } from '../services/apiClient';

export type DashboardRole = 'OWNER' | 'OPS' | 'EMPLOYEE' | 'ACCOUNTANT';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: DashboardRole;
  businessId?: string;
  businessName: string;
  avatarUrl: string;
}

export const DEMO_PERSONAS: Record<'OWNER' | 'OPS' | 'EMPLOYEE', UserProfile> = {
  OWNER: {
    id: 'demo-owner-001',
    name: 'Ravi',
    email: 'ravi.owner@grownova.in',
    role: 'OWNER',
    businessId: 'demo-biz-001',
    businessName: 'Shree Ganesh Textiles',
    avatarUrl: '/ravi_avatar_hq.jpg',
  },
  OPS: {
    id: 'demo-ops-002',
    name: 'manager',
    email: 'manager.ops@grownova.in',
    role: 'OPS',
    businessId: 'demo-biz-001',
    businessName: 'Shree Ganesh Textiles',
    avatarUrl: '/ravi_avatar_hq.jpg',
  },
  EMPLOYEE: {
    id: 'demo-emp-003',
    name: 'employee',
    email: 'employee@grownova.in',
    role: 'EMPLOYEE',
    businessId: 'demo-biz-001',
    businessName: 'Shree Ganesh Textiles',
    avatarUrl: '/ravi_avatar_hq.jpg',
  },
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLiveAuthenticated: boolean;
  isDemoMode: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<UserProfile>;
  signup: (data: { name: string; email: string; businessName: string; password?: string }) => Promise<UserProfile>;
  logout: () => Promise<void>;
  switchBusiness: (newBusinessName: string) => void;
  switchRole: (role: DashboardRole) => void;
  setDemoPersona: (role: 'OWNER' | 'OPS' | 'EMPLOYEE') => void;
  exitDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize and restore session on mount
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const accessToken = tokenStorage.getAccessToken();

      // 1. Attempt live session restoration if tokens are present
      if (accessToken) {
        try {
          const me = await apiClient.get<any>('/auth/me');
          if (isMounted && me) {
            const liveUser: UserProfile = {
              id: me.id || me.sub,
              name: me.name || me.email?.split('@')[0] || 'GrowNova User',
              email: me.email,
              role: (me.role as DashboardRole) || 'OWNER',
              businessId: me.businessId,
              businessName: 'GrowNova Enterprise',
              avatarUrl: '/ravi_avatar_hq.jpg',
            };
            setUser(liveUser);
            setIsDemoMode(false);
            setIsLoading(false);
            return;
          }
        } catch {
          // Token invalid and refresh failed; clear live session
          tokenStorage.clear();
        }
      }

      // 2. Check if explicit demo mode session exists in localStorage
      const savedDemoRole = localStorage.getItem('grownova_demo_role');
      if (savedDemoRole && (savedDemoRole === 'OWNER' || savedDemoRole === 'OPS' || savedDemoRole === 'EMPLOYEE')) {
        if (isMounted) {
          setUser(DEMO_PERSONAS[savedDemoRole]);
          setIsDemoMode(true);
          setIsLoading(false);
          return;
        }
      }

      // 3. Fallback: unauthenticated state
      if (isMounted) {
        setUser(null);
        setIsDemoMode(false);
        setIsLoading(false);
      }
    };

    restoreSession();

    // Listen for global session expiration events (e.g. fatal 401s)
    const unsubscribe = apiClient.onSessionExpired(() => {
      if (isMounted) {
        setUser(null);
        setIsDemoMode(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  /**
   * Live Authentication: Sign In
   * POST /api/auth/login
   *
   * SECURITY: Never falls back silently to demo mode on failure.
   */
  const login = async (email: string, password?: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      // Clear demo artifacts
      localStorage.removeItem('grownova_demo_role');

      const response = await apiClient.post<{
        accessToken: string;
        refreshToken: string;
        user: {
          id: string;
          email: string;
          name: string;
          role: string;
          businessId: string;
        };
      }>('/auth/login', {
        email: email.trim(),
        password: password || '',
      }, { skipAuth: true });

      if (!response?.accessToken || !response?.user) {
        throw new Error('Authentication response did not contain tokens');
      }

      tokenStorage.setAccessToken(response.accessToken);
      tokenStorage.setRefreshToken(response.refreshToken);

      const liveUser: UserProfile = {
        id: response.user.id,
        name: response.user.name || response.user.email.split('@')[0],
        email: response.user.email,
        role: (response.user.role as DashboardRole) || 'OWNER',
        businessId: response.user.businessId,
        businessName: 'GrowNova Enterprise',
        avatarUrl: '/ravi_avatar_hq.jpg',
      };

      setUser(liveUser);
      setIsDemoMode(false);
      return liveUser;
    } catch (err: any) {
      // Never silently fall back to demo mode on error
      setUser(null);
      setIsDemoMode(false);
      tokenStorage.clear();
      const message = err instanceof ApiError ? err.message : (err?.message || 'Invalid email or password');
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Live Authentication: Sign Up
   * POST /api/auth/signup
   */
  const signup = async (data: { name: string; email: string; businessName: string; password?: string }): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      localStorage.removeItem('grownova_demo_role');

      await apiClient.post('/auth/signup', {
        email: data.email.trim(),
        name: data.name.trim(),
        password: data.password || 'GrowNovaPass@2025',
        businessId: 'default-business-id',
      }, { skipAuth: true });

      return await login(data.email, data.password || 'GrowNovaPass@2025');
    } catch (err: any) {
      setUser(null);
      setIsDemoMode(false);
      tokenStorage.clear();
      const message = err instanceof ApiError ? err.message : (err?.message || 'Registration failed');
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign Out
   * POST /api/auth/logout (for live users) and local storage clearance
   */
  const logout = async (): Promise<void> => {
    if (!isDemoMode && tokenStorage.getAccessToken()) {
      try {
        await apiClient.post('/auth/logout');
      } catch {
        // Backend might be offline; continue local session termination
      }
    }
    tokenStorage.clear();
    localStorage.removeItem('grownova_demo_role');
    setUser(null);
    setIsDemoMode(false);
  };

  /**
   * Explicit Demo Entry
   * Sets up isolated demo state without touching backend tokens.
   */
  const setDemoPersona = useCallback((role: 'OWNER' | 'OPS' | 'EMPLOYEE') => {
    tokenStorage.clear();
    localStorage.setItem('grownova_demo_role', role);
    setUser(DEMO_PERSONAS[role]);
    setIsDemoMode(true);
  }, []);

  /**
   * Explicit Demo Exit
   */
  const exitDemoMode = useCallback(() => {
    localStorage.removeItem('grownova_demo_role');
    setUser(null);
    setIsDemoMode(false);
  }, []);

  /**
   * Role Switching
   * Allowed ONLY in demo mode. Forbidden in live authenticated sessions to prevent privilege escalation.
   */
  const switchRole = useCallback((newRole: DashboardRole) => {
    if (isDemoMode) {
      const personaKey = newRole === 'OPS' ? 'OPS' : newRole === 'EMPLOYEE' ? 'EMPLOYEE' : 'OWNER';
      setDemoPersona(personaKey);
    } else {
      console.warn('Frontend role escalation is prohibited for live authenticated accounts.');
    }
  }, [isDemoMode, setDemoPersona]);

  const switchBusiness = useCallback((newBusinessName: string) => {
    setUser((prev) => (prev ? { ...prev, businessName: newBusinessName } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLiveAuthenticated: !!user && !isDemoMode,
        isDemoMode,
        isLoading,
        login,
        signup,
        logout,
        switchBusiness,
        switchRole,
        setDemoPersona,
        exitDemoMode,
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

export default AuthContext;
