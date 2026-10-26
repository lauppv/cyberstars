import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import i18next from 'i18next';
import { useAuth } from './AuthContext';
import { canAccessFeature } from '@cyberstars/shared/features';
import { useUserSocketFrames } from './UserSocketContext';
import * as notificationsService from '../services/notificationsService';
import { COLLAPSIBLE_TYPES } from '@cyberstars/shared/notifications';
import type { NotificationDTO, UserSocketFrame } from '@cyberstars/shared/notifications';

const PAGE_SIZE = 20;

/** The server's reason in the page's language, else a general one. */
function errMsg(err: unknown): string {
  return err instanceof Error && err.message ? err.message : i18next.t('common.somethingWrong');
}

interface NotificationContextValue {
  enabled: boolean;
  items: NotificationDTO[];
  unreadCount: number;
  loading: boolean;
  hasMore: boolean;
  // The list didn't load; kept until a load works, live rows or not.
  loadFailed: boolean;
  reload: () => void;
  // Why the last "load more" didn't.
  moreError: string | null;
  loadMore: () => void;
  markAllRead: () => void;
  markOneRead: (id: number) => void;
  // Shows one the server has read already as read; the server's push brings
  // the count.
  noteRead: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const enabled = isLoggedIn && canAccessFeature('notifications', user?.role, import.meta.env.PROD);

  const [items, setItems] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [moreError, setMoreError] = useState<string | null>(null);
  // Bumped by each first-page load and by its cancel, so only the latest
  // load's answer lands.
  const loads = useRef(0);

  // Loads the first page; the function it returns drops the answer of any
  // load still on its way, this one or a retry after it.
  const loadFirstPage = useCallback(() => {
    const load = ++loads.current;
    setLoading(true);
    setLoadFailed(false);
    notificationsService
      .getNotifications(PAGE_SIZE)
      .then((page) => {
        if (load !== loads.current) return;
        setItems(page.items);
        setUnreadCount(page.unreadCount);
        setHasMore(page.items.length === PAGE_SIZE);
        setMoreError(null);
      })
      .catch(() => {
        if (load === loads.current) setLoadFailed(true);
      })
      .finally(() => {
        if (load === loads.current) setLoading(false);
      });
    return () => {
      loads.current++;
    };
  }, []);

  const reload = useCallback(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  // Initial load (and reset when the feature turns off, e.g. logout).
  useEffect(() => {
    if (!enabled) {
      setItems([]); // eslint-disable-line react-hooks/set-state-in-effect
      setUnreadCount(0);
      setHasMore(false);
      setLoadFailed(false);
      setMoreError(null);
      return;
    }
    return loadFirstPage();
  }, [enabled, loadFirstPage]);

  // Live updates over the shared /ws/user socket.
  const onFrame = useCallback((frame: UserSocketFrame) => {
    if (frame.channel !== 'notification') return;
    if (frame.type === 'unread-count') {
      setUnreadCount(frame.payload.unreadCount);
    } else if (frame.type === 'new') {
      const incoming = frame.payload;
      // A collapsed event arrives as a REPLACEMENT row (fresh id). The unread
      // row it superseded was deleted server-side, so drop our copy of it too.
      const collapsible = COLLAPSIBLE_TYPES.has(incoming.type);
      setItems((prev) => [
        incoming,
        ...prev.filter(
          (n) =>
            n.id !== incoming.id &&
            !(
              collapsible &&
              !n.readAt &&
              n.type === incoming.type &&
              n.entityId === incoming.entityId
            ),
        ),
      ]);
    }
  }, []);
  useUserSocketFrames(onFrame);

  const loadMore = useCallback(() => {
    const before = items[items.length - 1]?.id;
    if (before == null) return;
    setMoreError(null);
    notificationsService
      .getNotifications(PAGE_SIZE, before)
      .then((page) => {
        // Dedupe: a server-side collapse between two pages replaces a row with a
        // fresh id, which can shift the keyset and resend a row we already hold.
        setItems((prev) => [
          ...prev,
          ...page.items.filter((item) => !prev.some((n) => n.id === item.id)),
        ]);
        setHasMore(page.items.length === PAGE_SIZE);
      })
      .catch((err: unknown) => setMoreError(errMsg(err)));
  }, [items]);

  const markAllRead = useCallback(() => {
    if (items.length === 0 || unreadCount === 0) return;
    // Not items[0]: the list is ordered by recency, which matches id order only
    // as long as no stale row slipped in, so take the true max to be safe.
    const upToId = Math.max(...items.map((n) => n.id));
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

  const noteRead = useCallback((id: number) => {
    const now = new Date().toISOString();
    setItems((prev) => prev.map((n) => (n.id === id && !n.readAt ? { ...n, readAt: now } : n)));
  }, []);

  return (
    <NotificationContext
      value={{
        enabled,
        items,
        unreadCount,
        loading,
        hasMore,
        loadFailed,
        reload,
        moreError,
        loadMore,
        markAllRead,
        markOneRead,
        noteRead,
      }}
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
