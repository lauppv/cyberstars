import { createContext, useContext, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { GuestSignupModal } from '../components/ui/GuestSignupModal';

const SEEN_KEY = 'cyberstars.guestSignupPrompt.seen';

interface GuestSignupPromptContextType {
  // Call after a guest's code run finishes. Shows the signup nudge once (per
  // browser) on the first successful run; no-op for logged-in users.
  notifyRunComplete: (exitCode: number | undefined) => void;
}

const GuestSignupPromptContext = createContext<GuestSignupPromptContextType | null>(null);

function alreadySeen(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markSeen(): void {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // ignore (private mode / storage disabled)
  }
}

export function GuestSignupPromptProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [visible, setVisible] = useState(false);

  const notifyRunComplete = useCallback(
    (exitCode: number | undefined) => {
      if (isLoggedIn || exitCode !== 0 || alreadySeen()) return;
      markSeen();
      setVisible(true);
    },
    [isLoggedIn],
  );

  const close = useCallback(() => setVisible(false), []);

  return (
    <GuestSignupPromptContext value={{ notifyRunComplete }}>
      {children}
      {visible && !isLoggedIn && <GuestSignupModal onClose={close} />}
    </GuestSignupPromptContext>
  );
}

const NOOP_PROMPT: GuestSignupPromptContextType = { notifyRunComplete: () => {} };

// Falls back to a no-op when no provider is mounted (e.g. CodeCell rendered in
// isolation in unit tests) — the nudge is optional UX, never load-bearing.
// eslint-disable-next-line react-refresh/only-export-components
export function useGuestSignupPrompt(): GuestSignupPromptContextType {
  return useContext(GuestSignupPromptContext) ?? NOOP_PROMPT;
}
