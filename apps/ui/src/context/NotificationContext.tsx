import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import i18next from 'i18next';
import { useAuth } from './AuthContext';
import { canAccessFeature } from '@cyberstars/shared/features';
import { useUserSocketFrames } from './UserSocketContext';
import * as notificationsService from '../services/notificationsService';
import { EMPTY_SECTIONS } from '@cyberstars/shared/notifications';
import type {
  NotificationDTO,
  NotificationSection,
  UnreadSections,
  UserSocketFrame,
} from '@cyberstars/shared/notifications';

const PAGE_SIZE = 20;

/** The server's reason in the page's language, else a general one. */
function errMsg(err: unknown): string {
  return err instanceof Error && err.message ? err.message : i18next.t('common.somethingWrong');
}

interface NotificationContextValue {
  enabled: boolean;
  // The bell's rows and unread count
  items: NotificationDTO[];
  unreadCount: number;
  // What each sidebar row has unread
  sections: UnreadSections;
  // Shows a section read here at once, all of it or one thread or ticket; the
  // server's push brings the true counts
  clearSection: (section: NotificationSection, entityId?: number) => void;
  // The page of a section, or one thread or ticket of it, is open: clears it
  // here and tells the server
  markSectionRead: (section: NotificationSection, entityId?: number) => void;
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
  // An announcement or a poll opened from the bell is on screen, so the
  // dashboard's window waits for it
  bellWindow: boolean;
  noteBellWindow: (open: boolean) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const enabled = isLoggedIn && canAccessFeature('notifications', user?.role, import.meta.env.PROD);

  const [items, setItems] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sections, setSections] = useState<UnreadSections>(EMPTY_SECTIONS);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [moreError, setMoreError] = useState<string | null>(null);
  const [bellWindow, setBellWindow] = useState(false);
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
        setSections(page.sections);
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
      setSections(EMPTY_SECTIONS);
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
      setSections(frame.payload.sections);
    } else if (frame.type === 'new') {
      // Only bell rows come as 'new', and none of them collapse, so a row is
      // only ever new or the same one again
      const incoming = frame.payload;
      setItems((prev) => [incoming, ...prev.filter((n) => n.id !== incoming.id)]);
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

  const clearSection = useCallback((section: NotificationSection, entityId?: number) => {
    setSections((prev) => {
      if (section === 'forum' || section === 'support') {
        const left =
          entityId === undefined ? [] : prev[section].filter((e) => e.entityId !== entityId);
        return left.length === prev[section].length ? prev : { ...prev, [section]: left };
      }
      return prev[section] === 0 ? prev : { ...prev, [section]: 0 };
    });
  }, []);

  const markSectionRead = useCallback(
    (section: NotificationSection, entityId?: number) => {
      if (!enabled) return;
      clearSection(section, entityId);
      // Sent even when nothing shows unread here: the first page may still be
      // on its way, and the server pushes counts only when it read something
      notificationsService.markSectionRead(section, entityId).catch(() => {});
    },
    [enabled, clearSection],
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
        sections,
        clearSection,
        markSectionRead,
        loading,
        hasMore,
        loadFailed,
        reload,
        moreError,
        loadMore,
        markAllRead,
        markOneRead,
        noteRead,
        bellWindow,
        noteBellWindow: setBellWindow,
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
