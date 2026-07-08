import { useCallback, useEffect, useState } from 'react';

export type BackgroundKind = 'minimal' | 'cosmos';

const STORAGE_KEY = 'cyberstars.background';
const CHANGE_EVENT = 'cyberstars:backgroundchange';
const DEFAULT: BackgroundKind = 'minimal';

function read(): BackgroundKind {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'cosmos' ? 'cosmos' : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function useBackgroundPref(): [BackgroundKind, (next: BackgroundKind) => void] {
  const [kind, setKind] = useState<BackgroundKind>(read);

  useEffect(() => {
    const sync = () => setKind(read());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const update = useCallback((next: BackgroundKind) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage may be blocked; still fan out the in-memory change
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return [kind, update];
}
