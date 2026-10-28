import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { NotificationDTO } from '@cyberstars/shared/notifications';

const mockNavigate = vi.fn();
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }));

const ctx = {
  items: [] as NotificationDTO[],
  unreadCount: 0,
  loading: false,
  hasMore: false,
  loadFailed: false,
  reload: vi.fn(),
  moreError: null as string | null,
  loadMore: vi.fn(),
  markAllRead: vi.fn(),
  markOneRead: vi.fn(),
};
const onAnnouncement = vi.fn();
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
    loadFailed: false,
    reload: vi.fn(),
    moreError: null,
    loadMore: vi.fn(),
    markAllRead: vi.fn(),
    markOneRead: vi.fn(),
    ...extra,
  });
  return render(<NotificationDropdown onClose={vi.fn()} onAnnouncement={onAnnouncement} />);
}

beforeEach(() => {
  vi.clearAllMocks();
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

  it('counts the open Laniakea recaps', () => {
    renderWith([
      n({ id: 1, type: 'LANIAKEA_RECAP', entityId: 0, actor: null, data: { count: 1 } }),
      n({ id: 2, type: 'LANIAKEA_RECAP', entityId: 0, actor: null, data: { count: 3 } }),
    ]);
    expect(screen.getByText('A Laniakea recap is open')).toBeInTheDocument();
    expect(screen.getByText('3 Laniakea recaps are open')).toBeInTheDocument();
  });
});

describe('NotificationDropdown routing', () => {
  it('routes a forum notification to the thread URL', () => {
    renderWith([n({ type: 'FORUM_REPLY', entityId: 7 })]);
    fireEvent.click(screen.getByRole('menuitem'));
    expect(mockNavigate).toHaveBeenCalledWith('/forum/t/7');
  });

  it.each(['SUPPORT_TICKET_NEW', 'SUPPORT_REPLY', 'SUPPORT_STATUS'] as const)(
    'opens the ticket of a %s',
    (type) => {
      renderWith([n({ type, entityId: 12 })]);
      fireEvent.click(screen.getByRole('menuitem'));
      expect(mockNavigate).toHaveBeenCalledWith('/support?ticket=12');
    },
  );

  it('routes a connection request to /connections', () => {
    renderWith([n({ type: 'CONNECTION_REQUEST' })]);
    fireEvent.click(screen.getByRole('menuitem'));
    expect(mockNavigate).toHaveBeenCalledWith('/connections');
  });

  it('routes a Laniakea recap to the game', () => {
    renderWith([n({ type: 'LANIAKEA_RECAP', entityId: 0, data: { count: 2 } })]);
    fireEvent.click(screen.getByRole('menuitem'));
    expect(mockNavigate).toHaveBeenCalledWith('/laniakea');
  });

  it('opens an announcement in a window instead of a page, and reads it', () => {
    const item = n({ id: 4, type: 'ANNOUNCEMENT', entityId: 0, data: { text: 'New course' } });
    renderWith([item]);
    fireEvent.click(screen.getByRole('menuitem'));
    expect(onAnnouncement).toHaveBeenCalledWith(item);
    expect(ctx.markOneRead).toHaveBeenCalledWith(4);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('NotificationDropdown announcement', () => {
  it('shows the text cut to two lines next to a View button', () => {
    renderWith([n({ type: 'ANNOUNCEMENT', entityId: 0, data: { text: 'New course' } })]);
    expect(screen.getByText('Official announcement: New course')).toHaveClass('line-clamp-2');
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('leaves the View button off every other row', () => {
    renderWith([n()]);
    expect(screen.getByText('Ada replied to "Thread"')).not.toHaveClass('line-clamp-2');
    expect(screen.queryByText('View')).toBeNull();
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

  it('says the list failed to load instead of showing it empty, with a retry', () => {
    const reload = vi.fn();
    renderWith([], { loadFailed: true, reload });
    expect(screen.getByRole('alert')).toHaveTextContent("Your notifications couldn't be loaded.");
    expect(screen.queryByText("You're all caught up.")).toBeNull();
    fireEvent.click(screen.getByText('Try again'));
    expect(reload).toHaveBeenCalled();
  });

  it('keeps the failed load in view above live rows', () => {
    renderWith([n()], { loadFailed: true });
    expect(screen.getByRole('alert')).toHaveTextContent("Your notifications couldn't be loaded.");
    expect(screen.getByText('Ada replied to "Thread"')).toBeInTheDocument();
  });

  it('says why loading more failed and keeps the button', () => {
    renderWith([n()], { hasMore: true, moreError: 'Too many requests' });
    expect(screen.getByRole('alert')).toHaveTextContent('Too many requests');
    expect(screen.getByText('Load more')).toBeInTheDocument();
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
