import { useCallback, useState } from 'react';

const KEY = 'cyberstars.devModeHint';

function read(storage: () => Storage): string | null {
  try {
    return storage().getItem(KEY);
  } catch {
    return null;
  }
}

function write(storage: () => Storage) {
  try {
    storage().setItem(KEY, 'closed');
  } catch {
    // storage blocked: the choice lasts for this page
  }
}

const session = () => sessionStorage;
const device = () => localStorage;

// The card on a Web Development lesson that recommends dev mode. It comes
// back with every new session (a tab opened again) until the student closes
// it for good: closing it, or pressing dev mode, lasts for this session;
// "don't show me again" lasts on the device.
export function useDevModeHint(): {
  open: boolean;
  close: () => void;
  closeForGood: () => void;
} {
  const [open, setOpen] = useState(() => read(device) === null && read(session) === null);

  const close = useCallback(() => {
    write(session);
    setOpen(false);
  }, []);

  const closeForGood = useCallback(() => {
    write(device);
    setOpen(false);
  }, []);

  return { open, close, closeForGood };
}
