import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { NotificationDTO } from '../../../shared/notifications';

const mockNavigate = vi.fn();
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }));

let role = 'USER';
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ user: { role } }) }));

const ctx = {
  items: [] as NotificationDTO[],
  unreadCount: 0,
  loading: false,
  hasMore: false,
  loadMore: vi.fn(),
  markAllRead: vi.fn(),
  markOneRead: vi.fn(),
};
vi.mock('../../context/NotificationContext', () => ({ useNotifications: () => ctx }));

import { NotificationDropdown } from './NotificationDropdown';

function n(over: Partial<NotificationDTO> = {}): NotificationDTO {
  return {
    id: 1,
    type: 'FORUM_REPLY',
    entityId: 5,
    data: { title: 'Thread' },
    actor: { name: 'Ada', avatarUrl: null },
    readAt: null,
    createdAt: new Date().toISOString(),
    ...over,
  };
}

function renderWith(items: NotificationDTO[], extra: Partial<typeof ctx> = {}) {
  Object.assign(ctx, {
    items,
    unreadCount: 0,
    loading: false,
    hasMore: false,
    loadMore: vi.fn(),
    markAllRead: vi.fn(),
    markOneRead: vi.fn(),
    ...extra,
  });
  return render(<NotificationDropdown onClose={vi.fn()} />);
}

beforeEach(() => {
  vi.clearAllMocks();
  role = 'USER';
});

describe('NotificationDropdown copy', () => {
  it('renders a single forum reply with the actor name', () => {
    renderWith([n()]);
    expect(screen.getByText('Ada replied to "Thread"')).toBeInTheDocument();
  });

  it('renders a collapsed forum reply with the count', () => {
    renderWith([n({ data: { title: 'Thread', count: 3 } })]);
    expect(screen.getByText('3 new replies on "Thread"')).toBeInTheDocument();
  });

  it('falls back to "Someone" when the actor was deleted', () => {
    renderWith([n({ actor: null })]);
    expect(screen.getByText('Someone replied to "Thread"')).toBeInTheDocument();
  });

  it('renders solution, reaction, ticket, reply and status copy', () => {
    renderWith([
      n({ id: 1, type: 'FORUM_SOLUTION' }),
      n({ id: 2, type: 'FORUM_REACTION' }),
      n({ id: 4, type: 'SUPPORT_TICKET_NEW' }),
      n({ id: 5, type: 'SUPPORT_REPLY' }),
      n({ id: 6, type: 'SUPPORT_STATUS', data: { title: 'Thread', status: 'RESOLVED' } }),
    ]);
    expect(screen.getByText(/marked your reply as the solution/)).toBeInTheDocument();
    expect(screen.getByText(/reacted to your post/)).toBeInTheDocument();
    expect(screen.getByText('New support ticket: "Thread"')).toBeInTheDocument();
    expect(screen.getByText('New reply on ticket "Thread"')).toBeInTheDocument();
    expect(screen.getByText('Ticket "Thread" is now Resolved')).toBeInTheDocument();
  });
});

describe('NotificationDropdown routing', () => {
  it('routes a forum notification to the thread URL', () => {
    renderWith([n({ type: 'FORUM_REPLY', entityId: 7 })]);
    fireEvent.click(screen.getByRole('menuitem'));
    expect(mockNavigate).toHaveBeenCalledWith('/forum/t/7');
  });

  it('routes a support ticket to /admin', () => {
    renderWith([n({ type: 'SUPPORT_TICKET_NEW' })]);
    fireEvent.click(screen.getByRole('menuitem'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('routes a support reply to /support for a regular user', () => {
    renderWith([n({ type: 'SUPPORT_REPLY' })]);
    fireEvent.click(screen.getByRole('menuitem'));
    expect(mockNavigate).toHaveBeenCalledWith('/support');
  });

  it('routes a support reply to /admin for an admin', () => {
    role = 'ADMIN';
    renderWith([n({ type: 'SUPPORT_REPLY' })]);
    fireEvent.click(screen.getByRole('menuitem'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('routes a status change to /support and a connection request to /connections', () => {
    renderWith([n({ id: 1, type: 'SUPPORT_STATUS' }), n({ id: 2, type: 'CONNECTION_REQUEST' })]);
    const items = screen.getAllByRole('menuitem');
    fireEvent.click(items[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/support');
    fireEvent.click(items[1]);
    expect(mockNavigate).toHaveBeenCalledWith('/connections');
  });
});

describe('NotificationDropdown pagination', () => {
  it('shows and triggers load more', () => {
    const loadMore = vi.fn();
    renderWith([n()], { hasMore: true, loadMore });
    fireEvent.click(screen.getByText('Load more'));
    expect(loadMore).toHaveBeenCalled();
  });

  it('shows a loading placeholder before items arrive', () => {
    renderWith([], { loading: true });
    expect(screen.getByText('…')).toBeInTheDocument();
  });
});

describe('NotificationDropdown relative time', () => {
  const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

  it('renders a minutes-ago timestamp', () => {
    renderWith([n({ createdAt: ago(5 * 60_000) })]);
    expect(screen.getByText('5m ago')).toBeInTheDocument();
  });

  it('renders an hours-ago timestamp', () => {
    renderWith([n({ createdAt: ago(3 * 60 * 60_000) })]);
    expect(screen.getByText('3h ago')).toBeInTheDocument();
  });

  it('renders a days-ago timestamp', () => {
    renderWith([n({ createdAt: ago(3 * 24 * 60 * 60_000) })]);
    expect(screen.getByText('3d ago')).toBeInTheDocument();
  });

  it('falls back to a full date for older notifications', () => {
    const old = new Date(Date.now() - 60 * 24 * 60 * 60_000);
    renderWith([n({ createdAt: old.toISOString() })]);
    expect(screen.getByText(old.toLocaleDateString())).toBeInTheDocument();
  });
});
