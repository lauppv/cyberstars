import { useSyncExternalStore } from 'react';

// Whether a deploy is going on: the maintenance screen shows over the app while
// it is, so whatever the page holds (the code in the editor) stays put
let on = false;
const listeners = new Set<() => void>();

export function setMaintenance(value: boolean): void {
  if (on === value) return;
  on = value;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useMaintenance(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => on,
    () => false,
  );
}

// nginx marks its maintenance page, so the backend's own 503 (a busy server)
// isn't taken for a deploy
export function isMaintenance(res: Response): boolean {
  return res.status === 503 && res.headers?.get('X-Maintenance') === '1';
}

// A refused socket can't say why and a page change asks the server nothing, so
// both ask here. The screen also asks this until the backend is back. Offline
// says nothing either way. HEAD, since a body left unread keeps the request open
export async function checkMaintenance(): Promise<void> {
  try {
    const res = await fetch('/api/time', { method: 'HEAD', cache: 'no-store' });
    setMaintenance(isMaintenance(res));
  } catch {
    // never reached the server
  }
}
