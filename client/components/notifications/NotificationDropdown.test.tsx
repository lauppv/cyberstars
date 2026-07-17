import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { NotificationDTO } from '../../../shared/notifications';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }));

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

  it('renders solution, reaction, dm, ticket, reply and status copy', () => {
    renderWith([
      n({ id: 1, type: 'FORUM_SOLUTION' }),
      n({ id: 2, type: 'FORUM_REACTION' }),
      n({ id: 3, type: 'DM_MESSAGE', data: { count: 2 } }),
      n({ id: 4, type: 'SUPPORT_TICKET_NEW' }),
      n({ id: 5, type: 'SUPPORT_REPLY' }),
      n({ id: 6, type: 'SUPPORT_STATUS', data: { title: 'Thread', status: 'RESOLVED' } }),
    ]);
    expect(screen.getByText(/marked your reply as the solution/)).toBeInTheDocument();
    expect(screen.getByText(/reacted to your post/)).toBeInTheDocument();
    expect(screen.getByText('2 new messages from Ada')).toBeInTheDocument();
    expect(screen.getByText('New support ticket: "Thread"')).toBeInTheDocument();
    expect(screen.getByText('New reply on ticket "Thread"')).toBeInTheDocument();
    expect(screen.getByText('Ticket "Thread" is now Resolved')).toBeInTheDocument();
  });
});

describe('NotificationDropdown routing', () => {
  it('routes a support ticket to /admin', () => {
    renderWith([n({ type: 'SUPPORT_TICKET_NEW' })]);
    fireEvent.click(screen.getByRole('menuitem'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin', undefined);
  });

  it('routes a support reply to /support for a regular user', () => {
    renderWith([n({ type: 'SUPPORT_REPLY' })]);
    fireEvent.click(screen.getByRole('menuitem'));
    expect(mockNavigate).toHaveBeenCalledWith('/support', undefined);
  });

  it('routes a support reply to /admin for an admin', () => {
    role = 'ADMIN';
    renderWith([n({ type: 'SUPPORT_REPLY' })]);
    fireEvent.click(screen.getByRole('menuitem'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin', undefined);
  });

  it('routes a status change to /support and a dm to /messages', () => {
    renderWith([n({ id: 1, type: 'SUPPORT_STATUS' }), n({ id: 2, type: 'DM_MESSAGE' })]);
    const items = screen.getAllByRole('menuitem');
    fireEvent.click(items[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/support', undefined);
    fireEvent.click(items[1]);
    expect(mockNavigate).toHaveBeenCalledWith('/messages', undefined);
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
