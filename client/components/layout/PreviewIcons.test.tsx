import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const h = vi.hoisted(() => ({
  auth: { user: { role: 'USER' } as { role: string } | null },
  notifications: { enabled: true, unreadCount: 0 },
}));

vi.mock('../../context/AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('../../context/NotificationContext', () => ({ useNotifications: () => h.notifications }));
vi.mock('../notifications/NotificationDropdown', () => ({
  NotificationDropdown: () => <div>dropdown</div>,
}));

import { NotificationBell } from './NotificationBell';

beforeEach(() => {
  vi.clearAllMocks();
  h.auth = { user: { role: 'USER' } };
  h.notifications = { enabled: true, unreadCount: 0 };
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
    h.notifications = { enabled: false, unreadCount: 0 };
    render(<NotificationBell />);
    fireEvent.click(screen.getByRole('button', { name: /Coming soon/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the hint when clicking outside', () => {
    h.notifications = { enabled: false, unreadCount: 0 };
    render(<NotificationBell />);
    fireEvent.click(screen.getByRole('button', { name: /Coming soon/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
