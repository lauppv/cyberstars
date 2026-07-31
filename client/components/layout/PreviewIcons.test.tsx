import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const h = vi.hoisted(() => ({
  navigate: vi.fn(),
  canAccess: vi.fn((..._a: unknown[]) => true),
  auth: { user: { role: 'USER' } as { role: string } | null },
  messages: { enabled: true, totalUnread: 0 },
  notifications: { enabled: true, unreadCount: 0 },
}));

vi.mock('react-router', () => ({ useNavigate: () => h.navigate }));
vi.mock('../../../shared/features', () => ({
  canAccessFeature: (...a: unknown[]) => h.canAccess(...a),
}));
vi.mock('../../context/AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('../../context/MessagesContext', () => ({ useMessages: () => h.messages }));
vi.mock('../../context/NotificationContext', () => ({ useNotifications: () => h.notifications }));
vi.mock('../notifications/NotificationDropdown', () => ({
  NotificationDropdown: () => <div>dropdown</div>,
}));

import { LeaderboardButton } from './LeaderboardButton';
import { MessagesButton } from './MessagesButton';
import { NotificationBell } from './NotificationBell';

beforeEach(() => {
  vi.clearAllMocks();
  h.canAccess.mockReturnValue(true);
  h.auth = { user: { role: 'USER' } };
  h.messages = { enabled: true, totalUnread: 0 };
  h.notifications = { enabled: true, unreadCount: 0 };
});

describe('LeaderboardButton', () => {
  it('navigates to /leaderboard when unlocked', () => {
    render(<LeaderboardButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Leaderboard' }));
    expect(h.navigate).toHaveBeenCalledWith('/leaderboard');
  });

  it('renders the locked "coming soon" treatment when the feature is gated', () => {
    h.canAccess.mockReturnValue(false);
    render(<LeaderboardButton />);
    const btn = screen.getByRole('button', { name: /Coming soon/ });
    fireEvent.click(btn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(h.navigate).not.toHaveBeenCalled();
  });
});

describe('MessagesButton', () => {
  it('navigates to /messages when enabled', () => {
    render(<MessagesButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Messages' }));
    expect(h.navigate).toHaveBeenCalledWith('/messages');
  });

  it('shows the unread badge capped at 9+', () => {
    h.messages = { enabled: true, totalUnread: 15 };
    render(<MessagesButton />);
    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it('renders locked when logged in but messaging is gated', () => {
    h.messages = { enabled: false, totalUnread: 0 };
    render(<MessagesButton />);
    expect(screen.getByRole('button', { name: /Coming soon/ })).toBeInTheDocument();
  });

  it('renders nothing when logged out', () => {
    h.messages = { enabled: false, totalUnread: 0 };
    h.auth = { user: null };
    const { container } = render(<MessagesButton />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('NotificationBell locked state', () => {
  it('renders locked when logged in but notifications are gated', () => {
    h.notifications = { enabled: false, unreadCount: 0 };
    render(<NotificationBell />);
    const btn = screen.getByRole('button', { name: /Coming soon/ });
    fireEvent.click(btn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders nothing when logged out', () => {
    h.notifications = { enabled: false, unreadCount: 0 };
    h.auth = { user: null };
    const { container } = render(<NotificationBell />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('LockedIcon popover', () => {
  it('closes the hint on Escape', () => {
    h.canAccess.mockReturnValue(false);
    render(<LeaderboardButton />);
    fireEvent.click(screen.getByRole('button', { name: /Coming soon/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the hint when clicking outside', () => {
    h.canAccess.mockReturnValue(false);
    render(<LeaderboardButton />);
    fireEvent.click(screen.getByRole('button', { name: /Coming soon/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
