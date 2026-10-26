import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import type { NotificationDTO, UserSocketFrame } from '@cyberstars/shared/notifications';

const h = vi.hoisted(() => ({
  auth: { isLoggedIn: true, user: { id: 1, role: 'USER' } as { id: number; role: string } | null },
  canAccess: vi.fn((..._a: unknown[]) => true),
  service: {
    getNotifications: vi.fn(),
    markRead: vi.fn(),
    markOneRead: vi.fn(),
  },
  frameHandler: null as ((f: UserSocketFrame) => void) | null,
}));

vi.mock('./AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('@cyberstars/shared/features', () => ({
  canAccessFeature: (...a: unknown[]) => h.canAccess(...a),
}));
vi.mock('../services/notificationsService', () => h.service);
vi.mock('../hooks/useUserSocket', () => ({
  useUserSocket: (_enabled: boolean, onFrame: (f: UserSocketFrame) => void) => {
    h.frameHandler = onFrame;
  },
}));

import { UserSocketProvider } from './UserSocketContext';
import { NotificationProvider, useNotifications } from './NotificationContext';

function notif(over: Partial<NotificationDTO> = {}): NotificationDTO {
  return {
    id: 100,
    type: 'FORUM_REPLY',
    actor: { id: 2, name: 'Ben', avatarUrl: null },
    entityId: 5,
    data: { title: 'T' },
    readAt: null,
    createdAt: '2026-07-17T11:00:00.000Z',
    ...over,
  } as NotificationDTO;
}

function Probe() {
  const {
    items,
    unreadCount,
    hasMore,
    loadFailed,
    reload,
    moreError,
    loadMore,
    markAllRead,
    markOneRead,
    noteRead,
  } = useNotifications();
  return (
    <div>
      <span data-testid="loadFailed">{String(loadFailed)}</span>
      <span data-testid="moreError">{moreError ?? ''}</span>
      <button onClick={() => reload()}>reload</button>
      <span data-testid="unread">{unreadCount}</span>
      <span data-testid="count">{items.length}</span>
      <span data-testid="ids">{items.map((n) => n.id).join(',')}</span>
      <span data-testid="hasMore">{String(hasMore)}</span>
      <button onClick={() => loadMore()}>more</button>
      <button onClick={() => markAllRead()}>all</button>
      <button onClick={() => markOneRead(100)}>one</button>
      <button onClick={() => noteRead(100)}>note</button>
      <span data-testid="read">{items.map((n) => n.readAt ?? 'unread').join(',')}</span>
    </div>
  );
}

function renderProvider() {
  return render(
    <UserSocketProvider>
      <NotificationProvider>
        <Probe />
      </NotificationProvider>
    </UserSocketProvider>,
  );
}

function dispatch(frame: UserSocketFrame) {
  act(() => h.frameHandler?.(frame));
}

beforeEach(() => {
  vi.clearAllMocks();
  h.frameHandler = null;
  h.auth = { isLoggedIn: true, user: { id: 1, role: 'USER' } };
  h.canAccess.mockReturnValue(true);
  h.service.getNotifications.mockResolvedValue({ items: [notif({ id: 100 })], unreadCount: 1 });
  h.service.markRead.mockResolvedValue(undefined);
  h.service.markOneRead.mockResolvedValue(undefined);
});

describe('NotificationContext', () => {
  it('loads the first page and unread count', async () => {
    renderProvider();
    expect(await screen.findByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('unread')).toHaveTextContent('1');
  });

  it('resets and skips loading when disabled', async () => {
    h.auth = { isLoggedIn: false, user: null };
    renderProvider();
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('0'));
    expect(h.service.getNotifications).not.toHaveBeenCalled();
  });

  it('updates the unread count from a socket frame', async () => {
    renderProvider();
    await screen.findByTestId('count');
    dispatch({ channel: 'notification', type: 'unread-count', payload: { unreadCount: 7 } });
    await waitFor(() => expect(screen.getByTestId('unread')).toHaveTextContent('7'));
  });

  it('hoists a new notification and drops the unread row it collapsed', async () => {
    renderProvider();
    await screen.findByTestId('count');
    // Same collapsible type + entity, unread: the incoming frame is a
    // replacement row (fresh id), so the superseded copy disappears.
    dispatch({ channel: 'notification', type: 'new', payload: notif({ id: 101 }) });
    await waitFor(() => expect(screen.getByTestId('ids')).toHaveTextContent('101'));
    // A different entity is unrelated, so both stay.
    dispatch({ channel: 'notification', type: 'new', payload: notif({ id: 102, entityId: 6 }) });
    await waitFor(() => expect(screen.getByTestId('ids')).toHaveTextContent('102,101'));
  });

  it('keeps same-entity unread rows for non-collapsible types', async () => {
    h.service.getNotifications.mockResolvedValue({
      items: [notif({ id: 100, type: 'SUPPORT_REPLY' })],
      unreadCount: 1,
    });
    renderProvider();
    await screen.findByTestId('count');
    dispatch({
      channel: 'notification',
      type: 'new',
      payload: notif({ id: 101, type: 'SUPPORT_REPLY' }),
    });
    await waitFor(() => expect(screen.getByTestId('ids')).toHaveTextContent('101,100'));
  });

  it('ignores non-notification frames', async () => {
    renderProvider();
    await screen.findByTestId('count');
    dispatch({ channel: 'dm', type: 'message', payload: { id: 1 } as never });
    await waitFor(() => expect(screen.getByTestId('unread')).toHaveTextContent('1'));
  });

  it('loadMore appends the next page and updates hasMore', async () => {
    h.service.getNotifications.mockResolvedValueOnce({
      items: [notif({ id: 100 })],
      unreadCount: 1,
    });
    renderProvider();
    await screen.findByTestId('count');
    h.service.getNotifications.mockResolvedValueOnce({
      items: [notif({ id: 90 })],
      unreadCount: 1,
    });
    fireEvent.click(screen.getByText('more'));
    await waitFor(() => expect(screen.getByTestId('ids')).toHaveTextContent('100,90'));
    expect(h.service.getNotifications).toHaveBeenLastCalledWith(20, 100);
  });

  it('markAllRead marks unread items read and zeroes the count', async () => {
    renderProvider();
    await screen.findByTestId('count');
    fireEvent.click(screen.getByText('all'));
    await waitFor(() => expect(screen.getByTestId('unread')).toHaveTextContent('0'));
    expect(h.service.markRead).toHaveBeenCalledWith(100);
  });

  it('markAllRead uses the max id even when the top item is not the newest', async () => {
    renderProvider();
    await screen.findByTestId('count');
    // An out-of-order frame (lower id) lands on top of the list.
    dispatch({
      channel: 'notification',
      type: 'new',
      payload: notif({ id: 60, type: 'SUPPORT_REPLY', entityId: 7 }),
    });
    await waitFor(() => expect(screen.getByTestId('ids')).toHaveTextContent('60,100'));
    fireEvent.click(screen.getByText('all'));
    await waitFor(() => expect(h.service.markRead).toHaveBeenCalledWith(100));
  });

  it('markAllRead is a no-op when nothing is unread', async () => {
    h.service.getNotifications.mockResolvedValue({ items: [notif({ id: 100 })], unreadCount: 0 });
    renderProvider();
    await screen.findByTestId('count');
    fireEvent.click(screen.getByText('all'));
    expect(h.service.markRead).not.toHaveBeenCalled();
  });

  it('markOneRead marks a single item and decrements', async () => {
    renderProvider();
    await screen.findByTestId('count');
    fireEvent.click(screen.getByText('one'));
    await waitFor(() => expect(screen.getByTestId('unread')).toHaveTextContent('0'));
    expect(h.service.markOneRead).toHaveBeenCalledWith(100);
  });

  it('markOneRead is a no-op for an already-read item', async () => {
    h.service.getNotifications.mockResolvedValue({
      items: [notif({ id: 100, readAt: '2026-07-17T12:00:00.000Z' })],
      unreadCount: 0,
    });
    renderProvider();
    await screen.findByTestId('count');
    fireEvent.click(screen.getByText('one'));
    expect(h.service.markOneRead).not.toHaveBeenCalled();
  });

  it('noteRead shows one read and leaves the count and the server alone', async () => {
    h.service.getNotifications.mockResolvedValue({
      items: [notif({ id: 100 }), notif({ id: 99, readAt: '2026-07-17T12:00:00.000Z' })],
      unreadCount: 1,
    });
    renderProvider();
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('2'));
    fireEvent.click(screen.getByText('note'));
    expect(screen.getByTestId('read')).not.toHaveTextContent('unread');
    expect(screen.getByTestId('read')).toHaveTextContent(/,2026-07-17T12:00:00.000Z$/);
    expect(screen.getByTestId('unread')).toHaveTextContent('1');
    fireEvent.click(screen.getByText('one'));
    expect(h.service.markOneRead).not.toHaveBeenCalled();
  });

  it('markOneRead is a no-op when the id is not in the list', async () => {
    h.service.getNotifications.mockResolvedValue({
      items: [notif({ id: 200 })],
      unreadCount: 1,
    });
    renderProvider();
    await screen.findByTestId('count');
    fireEvent.click(screen.getByText('one'));
    expect(h.service.markOneRead).not.toHaveBeenCalled();
  });

  it('keeps the failed first page until a reload brings it', async () => {
    h.service.getNotifications.mockRejectedValueOnce(new Error('Too many requests'));
    renderProvider();
    await waitFor(() => expect(screen.getByTestId('loadFailed')).toHaveTextContent('true'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');

    // A live row doesn't make the list whole.
    dispatch({ channel: 'notification', type: 'new', payload: notif({ id: 120 }) });
    expect(screen.getByTestId('loadFailed')).toHaveTextContent('true');

    fireEvent.click(screen.getByText('reload'));
    await waitFor(() => expect(screen.getByTestId('ids')).toHaveTextContent('100'));
    expect(screen.getByTestId('loadFailed')).toHaveTextContent('false');
  });

  it('lets only the latest first-page load land', async () => {
    let first: (v: unknown) => void = () => {};
    h.service.getNotifications
      .mockImplementationOnce(() => new Promise((resolve) => (first = resolve)))
      .mockResolvedValueOnce({ items: [notif({ id: 101 })], unreadCount: 3 });
    renderProvider();
    fireEvent.click(screen.getByText('reload'));
    await waitFor(() => expect(screen.getByTestId('ids')).toHaveTextContent('101'));
    await act(async () => first({ items: [notif({ id: 1 })], unreadCount: 9 }));
    expect(screen.getByTestId('ids')).toHaveTextContent('101');
    expect(screen.getByTestId('unread')).toHaveTextContent('3');
  });

  it('says why loading more failed and clears it once more loads', async () => {
    renderProvider();
    await screen.findByText('100');
    h.service.getNotifications.mockRejectedValueOnce(new Error('Too many requests'));
    fireEvent.click(screen.getByText('more'));
    await waitFor(() =>
      expect(screen.getByTestId('moreError')).toHaveTextContent('Too many requests'),
    );
    expect(screen.getByTestId('ids')).toHaveTextContent('100');

    h.service.getNotifications.mockResolvedValueOnce({
      items: [notif({ id: 90 })],
      unreadCount: 1,
    });
    fireEvent.click(screen.getByText('more'));
    await waitFor(() => expect(screen.getByTestId('ids')).toHaveTextContent('100,90'));
    expect(screen.getByTestId('moreError')).toHaveTextContent('');
  });

  it('drops a retry still on its way when the feature turns off', async () => {
    h.service.getNotifications.mockRejectedValueOnce(new Error('Too many requests'));
    const { rerender } = renderProvider();
    await waitFor(() => expect(screen.getByTestId('loadFailed')).toHaveTextContent('true'));
    let retry: (v: unknown) => void = () => {};
    h.service.getNotifications.mockImplementationOnce(
      () => new Promise((resolve) => (retry = resolve)),
    );
    fireEvent.click(screen.getByText('reload'));
    h.auth = { isLoggedIn: false, user: null };
    rerender(
      <UserSocketProvider>
        <NotificationProvider>
          <Probe />
        </NotificationProvider>
      </UserSocketProvider>,
    );
    await act(async () => retry({ items: [notif({ id: 100 })], unreadCount: 1 }));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('unread')).toHaveTextContent('0');
  });

  it('forgets both errors when the feature turns off', async () => {
    h.service.getNotifications.mockRejectedValueOnce(new Error('Too many requests'));
    const { rerender } = renderProvider();
    await waitFor(() => expect(screen.getByTestId('loadFailed')).toHaveTextContent('true'));
    h.auth = { isLoggedIn: false, user: null };
    rerender(
      <UserSocketProvider>
        <NotificationProvider>
          <Probe />
        </NotificationProvider>
      </UserSocketProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('loadFailed')).toHaveTextContent('false'));
  });

  it('loadMore is a no-op when there are no items yet', async () => {
    h.auth = { isLoggedIn: false, user: null };
    renderProvider();
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('0'));
    fireEvent.click(screen.getByText('more'));
    expect(h.service.getNotifications).not.toHaveBeenCalled();
  });

  it('ignores a notification frame with an unknown type', async () => {
    renderProvider();
    await screen.findByTestId('count');
    dispatch({
      channel: 'notification',
      type: 'bogus' as never,
      payload: { unreadCount: 99 } as never,
    });
    await waitFor(() => expect(screen.getByTestId('unread')).toHaveTextContent('1'));
  });
});

describe('useNotifications guard', () => {
  it('throws when used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/within NotificationProvider/);
    spy.mockRestore();
  });
});
