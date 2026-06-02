import { useEffect } from 'react';

// Holds one WebSocket open for the whole tab. No messages are exchanged — the
// connection's lifetime *is* the signal: when the tab closes (or the page is
// reloaded), the socket drops and the server promptly tears down this user's
// idle run container instead of waiting for the idle GC. Mounted once at the app
// root so it survives in-app navigation (which keeps the run container reusable).
export function usePresence(): void {
  useEffect(() => {
    if (typeof WebSocket === 'undefined') return;
    let ws: WebSocket | null = null;
    try {
      const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
      ws = new WebSocket(`${proto}//${location.host}/ws/presence`);
    } catch {
      return;
    }
    return () => {
      try {
        ws?.close();
      } catch {
        /* ignore */
      }
    };
  }, []);
}
