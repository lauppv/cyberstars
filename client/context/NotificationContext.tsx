import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { canAccessFeature } from '../../shared/features';
import { useUserSocket } from '../hooks/useUserSocket';
import * as notificationsService from '../services/notificationsService';
import type { NotificationDTO, UserSocketFrame } from '../../shared/notifications';

const PAGE_SIZE = 20;

interface NotificationContextValue {
  enabled: boolean;
  items: NotificationDTO[];
  unreadCount: number;
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  markAllRead: () => void;
  markOneRead: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const enabled = isLoggedIn && canAccessFeature('notifications', user?.role, import.meta.env.PROD);

  const [items, setItems] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // Initial load (and reset when the feature turns off, e.g. logout).
  useEffect(() => {
    if (!enabled) {
      setItems([]); // eslint-disable-line react-hooks/set-state-in-effect
      setUnreadCount(0);
      setHasMore(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    notificationsService
      .getNotifications(PAGE_SIZE)
      .then((page) => {
        if (cancelled) return;
        setItems(page.items);
        setUnreadCount(page.unreadCount);
        setHasMore(page.items.length === PAGE_SIZE);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  // Live updates over the shared /ws/user socket.
  const onFrame = useCallback((frame: UserSocketFrame) => {
    if (frame.channel !== 'notification') return;
    if (frame.type === 'unread-count') {
      setUnreadCount(frame.payload.unreadCount);
    } else if (frame.type === 'new') {
      const incoming = frame.payload;
      // A collapsed event reuses the same id — drop any existing copy and hoist
      // the fresh one to the top.
      setItems((prev) => [incoming, ...prev.filter((n) => n.id !== incoming.id)]);
    }
  }, []);
  useUserSocket(enabled, onFrame);

  const loadMore = useCallback(() => {
    const before = items[items.length - 1]?.id;
    if (before == null) return;
    notificationsService
      .getNotifications(PAGE_SIZE, before)
      .then((page) => {
        setItems((prev) => [...prev, ...page.items]);
        setHasMore(page.items.length === PAGE_SIZE);
      })
      .catch(() => {});
  }, [items]);

  const markAllRead = useCallback(() => {
    const upToId = items[0]?.id;
    if (upToId == null || unreadCount === 0) return;
    const now = new Date().toISOString();
    setItems((prev) => prev.map((n) => (n.readAt ? n : { ...n, readAt: now })));
    setUnreadCount(0);
    notificationsService.markRead(upToId).catch(() => {});
  }, [items, unreadCount]);

  const markOneRead = useCallback(
    (id: number) => {
      const target = items.find((n) => n.id === id);
      if (!target || target.readAt) return;
      const now = new Date().toISOString();
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, readAt: now } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
      notificationsService.markOneRead(id).catch(() => {});
    },
    [items],
  );

  return (
    <NotificationContext
      value={{ enabled, items, unreadCount, loading, hasMore, loadMore, markAllRead, markOneRead }}
    >
      {children}
    </NotificationContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
