import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { canAccessFeature } from '../../shared/features';
import { useUserSocket } from '../hooks/useUserSocket';
import type { UserSocketFrame } from '../../shared/notifications';

type FrameHandler = (frame: UserSocketFrame) => void;

interface UserSocketContextValue {
  subscribe: (handler: FrameHandler) => () => void;
}

const UserSocketContext = createContext<UserSocketContextValue | null>(null);

// Owns the one shared /ws/user connection at app root and fans each frame out to
// every subscriber. Notifications and messaging both ride this single socket —
// demuxed client-side on `frame.channel` — so we never open two connections.
export function UserSocketProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const enabled =
    isLoggedIn &&
    (canAccessFeature('notifications', user?.role, import.meta.env.PROD) ||
      canAccessFeature('messaging', user?.role, import.meta.env.PROD));

  const handlers = useRef(new Set<FrameHandler>());

  const onFrame = useCallback((frame: UserSocketFrame) => {
    for (const handler of handlers.current) handler(frame);
  }, []);
  useUserSocket(enabled, onFrame);

  const subscribe = useCallback((handler: FrameHandler) => {
    handlers.current.add(handler);
    return () => {
      handlers.current.delete(handler);
    };
  }, []);

  return <UserSocketContext value={{ subscribe }}>{children}</UserSocketContext>;
}

// Subscribe to the shared socket for the lifetime of the calling component. The
// latest `onFrame` is always used without re-subscribing.
// eslint-disable-next-line react-refresh/only-export-components
export function useUserSocketFrames(onFrame: FrameHandler): void {
  const ctx = useContext(UserSocketContext);
  const ref = useRef(onFrame);
  useEffect(() => {
    ref.current = onFrame;
  });
  useEffect(() => {
    if (!ctx) return;
    return ctx.subscribe((frame) => ref.current(frame));
  }, [ctx]);
}
