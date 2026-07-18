import { useEffect, useRef } from 'react';
import type { UserSocketFrame } from '../../shared/notifications';

// Holds the shared per-user event socket (/ws/user) open while `enabled`,
// demuxing nothing itself — it hands each parsed frame to `onFrame`, which
// switches on `frame.channel`. Reconnects with a fixed delay if the socket
// drops, since live notifications are the point. Shared with messaging later.
export function useUserSocket(enabled: boolean, onFrame: (frame: UserSocketFrame) => void): void {
  const handlerRef = useRef(onFrame);
  useEffect(() => {
    handlerRef.current = onFrame;
  });

  useEffect(() => {
    if (!enabled || typeof WebSocket === 'undefined') return;
    let ws: WebSocket | null = null;
    let closed = false;
    let reconnect: ReturnType<typeof setTimeout> | undefined;

    const connect = () => {
      const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
      try {
        ws = new WebSocket(`${proto}//${location.host}/ws/user`);
      } catch {
        return;
      }
      ws.onmessage = (e) => {
        try {
          handlerRef.current(JSON.parse(e.data as string) as UserSocketFrame);
        } catch {
          /* ignore malformed frames */
        }
      };
      ws.onclose = (e) => {
        // 4401/4404 are the server's deliberate refusals (expired token, preview
        // gate) — retrying every 3s would hammer it forever with the same answer.
        // Re-login re-establishes the socket via `enabled`.
        if (!closed && e.code !== 4401 && e.code !== 4404) {
          reconnect = setTimeout(connect, 3000);
        }
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
  }, [enabled]);
}
