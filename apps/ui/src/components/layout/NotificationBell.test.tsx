import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { NotificationDTO } from '@cyberstars/shared/notifications';

const announcement: NotificationDTO = {
  id: 9,
  type: 'ANNOUNCEMENT',
  entityId: 0,
  data: { text: 'A new course is out.\nGo try it.' },
  actor: null,
  readAt: null,
  createdAt: '2026-10-28T10:00:00.000Z',
};

const h = vi.hoisted(() => ({
  auth: { user: { role: 'USER' } as { role: string } | null },
  notif: { enabled: true, unreadCount: 0 },
}));

vi.mock('../../context/AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('../../context/NotificationContext', () => ({ useNotifications: () => h.notif }));
vi.mock('../notifications/NotificationDropdown', () => ({
  NotificationDropdown: ({
    onClose,
    onAnnouncement,
  }: {
    onClose: () => void;
    onAnnouncement: (n: NotificationDTO) => void;
  }) => (
    <div data-testid="dropdown">
      <button onClick={onClose}>close</button>
      <button
        onClick={() => {
          onClose();
          onAnnouncement(announcement);
        }}
      >
        announcement
      </button>
    </div>
  ),
}));
vi.mock('./LockedIcon', () => ({
  LockedIcon: ({ label }: { label: string }) => <div data-testid="locked">{label}</div>,
}));

import { NotificationBell } from './NotificationBell';

beforeEach(() => {
  vi.clearAllMocks();
  h.auth = { user: { role: 'USER' } };
  h.notif = { enabled: true, unreadCount: 0 };
});

describe('NotificationBell', () => {
  it('renders nothing when disabled and no user', () => {
    h.notif = { enabled: false, unreadCount: 0 };
    h.auth = { user: null };
    const { container } = render(<NotificationBell />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a locked icon when disabled but signed in', () => {
    h.notif = { enabled: false, unreadCount: 0 };
    render(<NotificationBell />);
    expect(screen.getByTestId('locked')).toBeInTheDocument();
  });

  it('shows no badge when there are no unread notifications', () => {
    render(<NotificationBell />);
    expect(screen.queryByText(/^\d/)).toBeNull();
  });

  it('shows the unread count badge', () => {
    h.notif = { enabled: true, unreadCount: 5 };
    render(<NotificationBell />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('caps the badge at 9+', () => {
    h.notif = { enabled: true, unreadCount: 42 };
    render(<NotificationBell />);
    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it('toggles the dropdown open and closed', () => {
    render(<NotificationBell />);
    const btn = screen.getByLabelText('Notifications');
    fireEvent.click(btn);
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    fireEvent.click(btn);
    expect(screen.queryByTestId('dropdown')).toBeNull();
  });

  it('closes on Escape', () => {
    render(<NotificationBell />);
    fireEvent.click(screen.getByLabelText('Notifications'));
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('dropdown')).toBeNull();
  });

  it('opens an announcement from the dropdown in a window over the page', () => {
    render(<NotificationBell />);
    fireEvent.click(screen.getByLabelText('Notifications'));
    fireEvent.click(screen.getByText('announcement'));
    expect(screen.queryByTestId('dropdown')).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Official announcement' })).toHaveTextContent(
      'A new course is out. Go try it.',
    );
    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes on an outside mousedown', () => {
    render(<NotificationBell />);
    fireEvent.click(screen.getByLabelText('Notifications'));
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId('dropdown')).toBeNull();
  });
});
