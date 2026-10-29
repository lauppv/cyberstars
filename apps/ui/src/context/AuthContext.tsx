import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  AuthenticatedUser as User,
  LoginPayload,
  SignupPayload,
} from '@cyberstars/shared/auth';
import * as authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Whether this browser last saw a signed-in student. The sign-in check takes
// a round trip; until it answers, the home page uses this to choose between
// the dashboard's spinner and the landing page, and public/boot.js uses it to
// hide the pre-rendered landing page before it paints. Keep the key in step.
const STUDENT_KEY = 'cyberstars.student';

// eslint-disable-next-line react-refresh/only-export-components
export function wasSignedIn(): boolean {
  try {
    return localStorage.getItem(STUDENT_KEY) !== null;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService
      .getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isLoading) return;
    try {
      if (user) localStorage.setItem(STUDENT_KEY, '1');
      else localStorage.removeItem(STUDENT_KEY);
    } catch {
      // storage may be blocked; the home page then guesses visitor
    }
  }, [user, isLoading]);

  // Another tab signed in or out, so this one follows and its presence socket counts the right person
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STUDENT_KEY) return;
      authService
        .getMe()
        .then(setUser)
        .catch(() => setUser(null));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    await authService.login(payload);
    const me = await authService.getMe();
    setUser(me);
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    await authService.signup(payload);
    const me = await authService.getMe();
    setUser(me);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(() => {
    authService
      .getMe()
      .then(setUser)
      .catch(() => {});
  }, []);

  return (
    <AuthContext
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
