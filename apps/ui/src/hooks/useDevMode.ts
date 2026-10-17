import { useCallback, useState, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'cyberstars.devMode';
// A phone has no room for three panels, so dev mode exists from a tablet up
const WIDE = '(min-width: 768px)';

function storedDevMode(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
}

function watchWidth(onChange: () => void) {
  const query = window.matchMedia?.(WIDE);
  query?.addEventListener('change', onChange);
  return () => query?.removeEventListener('change', onChange);
}

const isWide = () => window.matchMedia?.(WIDE).matches ?? true;

// Dev mode lays a lesson out over the whole window: the statement, the editor
// and the output, nothing else. It stays on across lessons and visits until
// the student turns it off, and only a wide enough window has it: on a
// narrower one the button is gone and the lesson looks as usual, even when it
// was left on.
export function useDevMode(): { available: boolean; on: boolean; toggle: () => void } {
  const [picked, setPicked] = useState(storedDevMode);
  const available = useSyncExternalStore(watchWidth, isWide, () => false);

  const toggle = useCallback(() => {
    setPicked((was) => {
      try {
        if (was) localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, 'on');
      } catch {
        // storage blocked: the choice lasts for this page
      }
      return !was;
    });
  }, []);

  return { available, on: picked && available, toggle };
}
