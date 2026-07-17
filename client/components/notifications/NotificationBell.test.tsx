import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { NotificationDTO, UserSocketFrame } from '../../../shared/notifications';

const h = vi.hoisted(() => ({
  navigate: vi.fn(),
  authState: { isLoggedIn: true, user: { role: 'USER' } as { role: string } | null },
  service: { getNotifications: vi.fn(), markRead: vi.fn(), markOneRead: vi.fn() },
  frameHandler: null as ((f: UserSocketFrame) => void) | null,
}));

vi.mock('react-router-dom', () => ({ useNavigate: () => h.navigate }));
vi.mock('../../context/AuthContext', () => ({ useAuth: () => h.authState }));
vi.mock('../../services/notificationsService', () => h.service);
vi.mock('../../hooks/useUserSocket', () => ({
  useUserSocket: (_enabled: boolean, onFrame: (f: UserSocketFrame) => void) => {
    h.frameHandler = onFrame;
  },
}));

const mockNavigate = h.navigate;
const mockService = h.service;

import { UserSocketProvider } from '../../context/UserSocketContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { NotificationBell } from '../layout/NotificationBell';

function notif(over: Partial<NotificationDTO> = {}): NotificationDTO {
  return {
    id: 1,
    type: 'FORUM_REPLY',
    entityId: 5,
    data: { title: 'Cosmic thread' },
    actor: { name: 'Ada', avatarUrl: null },
    readAt: null,
    createdAt: new Date().toISOString(),
    ...over,
  };
}

function renderBell() {
  return render(
    <UserSocketProvider>
      <NotificationProvider>
        <NotificationBell />
      </NotificationProvider>
    </UserSocketProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  h.frameHandler = null;
  h.authState = { isLoggedIn: true, user: { role: 'USER' } };
  mockService.getNotifications.mockResolvedValue({ items: [notif()], unreadCount: 1 });
  mockService.markRead.mockResolvedValue({ ok: true });
  mockService.markOneRead.mockResolvedValue({ ok: true });
});

describe('NotificationBell', () => {
  it('renders nothing when the user is logged out', () => {
    h.authState = { isLoggedIn: false, user: null };
    const { container } = renderBell();
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the unread badge and opens the dropdown with items', async () => {
    renderBell();
    expect(await screen.findByText('1')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));
    expect(await screen.findByText(/Ada replied to/)).toBeInTheDocument();
  });

  it('caps the badge at 9+', async () => {
    mockService.getNotifications.mockResolvedValue({ items: [notif()], unreadCount: 12 });
    renderBell();
    expect(await screen.findByText('9+')).toBeInTheDocument();
  });

  it('marks all read and clears the badge', async () => {
    renderBell();
    fireEvent.click(await screen.findByRole('button', { name: 'Notifications' }));
    fireEvent.click(await screen.findByText('Mark all read'));
    expect(mockService.markRead).toHaveBeenCalledWith(1);
    await waitFor(() => expect(screen.queryByText('1')).not.toBeInTheDocument());
  });

  it('marks one read and deep-links a forum notification to /forum', async () => {
    renderBell();
    fireEvent.click(await screen.findByRole('button', { name: 'Notifications' }));
    fireEvent.click(await screen.findByText(/Ada replied to/));
    expect(mockService.markOneRead).toHaveBeenCalledWith(1);
    expect(mockNavigate).toHaveBeenCalledWith('/forum', { state: { openThreadId: 5 } });
  });

  it('applies live unread-count and new frames from the socket', async () => {
    renderBell();
    await screen.findByText('1');
    h.frameHandler?.({
      channel: 'notification',
      type: 'unread-count',
      payload: { unreadCount: 4 },
    });
    expect(await screen.findByText('4')).toBeInTheDocument();
    h.frameHandler?.({
      channel: 'notification',
      type: 'new',
      payload: notif({ id: 2, actor: { name: 'Bo', avatarUrl: null } }),
    });
    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));
    expect(await screen.findByText(/Bo replied to/)).toBeInTheDocument();
  });

  it('shows the empty state when there are no notifications', async () => {
    mockService.getNotifications.mockResolvedValue({ items: [], unreadCount: 0 });
    renderBell();
    fireEvent.click(await screen.findByRole('button', { name: 'Notifications' }));
    expect(await screen.findByText("You're all caught up.")).toBeInTheDocument();
  });

  it('renders the bell without a badge when nothing is unread', async () => {
    mockService.getNotifications.mockResolvedValue({
      items: [notif({ readAt: null })],
      unreadCount: 0,
    });
    renderBell();
    await screen.findByRole('button', { name: 'Notifications' });
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('paginates via load more using the last id as the cursor', async () => {
    const first = Array.from({ length: 20 }, (_, i) => notif({ id: 100 - i }));
    mockService.getNotifications.mockResolvedValueOnce({ items: first, unreadCount: 20 });
    mockService.getNotifications.mockResolvedValueOnce({
      items: [notif({ id: 80 })],
      unreadCount: 20,
    });
    renderBell();
    fireEvent.click(await screen.findByRole('button', { name: 'Notifications' }));
    fireEvent.click(await screen.findByText('Load more'));
    await waitFor(() => expect(mockService.getNotifications).toHaveBeenLastCalledWith(20, 81));
  });

  it('navigates without re-marking an already-read notification', async () => {
    mockService.getNotifications.mockResolvedValue({
      items: [notif({ readAt: new Date().toISOString() })],
      unreadCount: 0,
    });
    renderBell();
    fireEvent.click(await screen.findByRole('button', { name: 'Notifications' }));
    fireEvent.click(await screen.findByText(/Ada replied to/));
    expect(mockService.markOneRead).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/forum', { state: { openThreadId: 5 } });
  });
});
