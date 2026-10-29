import { useEffect } from 'react';

// Holds one WebSocket open for the whole tab. No messages are exchanged; the
// connection's lifetime *is* the signal: when the tab closes (or the page is
// reloaded), the socket drops and the server promptly tears down this user's
// idle run container instead of waiting for the idle GC. Mounted once at the app
// root so it survives in-app navigation (which keeps the run container reusable).
// Opens again when the account changes (null a guest, undefined still loading), so the server counts the tab right
export function usePresence(userId: number | null | undefined): void {
  useEffect(() => {
    if (userId === undefined || typeof WebSocket === 'undefined') return;
    let ws: WebSocket | null = null;
    let closed = false;
    let reconnect: ReturnType<typeof setTimeout> | undefined;

    const connect = () => {
      try {
        const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
        ws = new WebSocket(`${proto}//${location.host}/ws/presence`);
      } catch {
        return;
      }
      // A restart (a deploy) drops it, so open it again to keep the tab counted
      ws.onclose = () => {
        if (!closed) reconnect = setTimeout(connect, 3000);
      };
    };
    connect();

    return () => {
      closed = true;
      if (reconnect) clearTimeout(reconnect);
      try {
        ws?.close();
      } catch {
        /* ignore */
      }
    };
  }, [userId]);
}
