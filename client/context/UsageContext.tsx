import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import * as usageService from '../services/usageService';
import type { UsageSummary } from '../../shared/usage';

interface UsageContextValue {
  // Current daily usage, or null before the first load / when logged out.
  summary: UsageSummary | null;
  loading: boolean;
  refresh: () => void;
  // Adopt a fresh summary returned by a consume call (solution reveal, AI hint)
  // so the meter updates without a round trip.
  applySummary: (summary: UsageSummary) => void;
}

const UsageContext = createContext<UsageContextValue | null>(null);

export function UsageProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    if (!isLoggedIn) {
      setSummary(null);
      return;
    }
    setLoading(true);
    usageService
      .getUsage()
      .then(setSummary)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      setSummary(null); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    refresh();
  }, [isLoggedIn, refresh]);

  return (
    <UsageContext value={{ summary, loading, refresh, applySummary: setSummary }}>
      {children}
    </UsageContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUsage(): UsageContextValue {
  const ctx = useContext(UsageContext);
  if (!ctx) throw new Error('useUsage must be used within UsageProvider');
  return ctx;
}
