import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

const h = vi.hoisted(() => ({
  navigate: vi.fn(),
  logout: vi.fn(),
  canAccess: vi.fn((..._a: unknown[]) => true),
  auth: {
    user: null as null | { name: string; email: string; role: string; avatarUrl: string | null },
  },
  messages: { enabled: true, totalUnread: 0 },
}));

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => h.navigate };
});
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ ...h.auth, logout: h.logout }),
}));
vi.mock('../../context/MessagesContext', () => ({ useMessages: () => h.messages }));
vi.mock('../../hooks/useGamification', () => ({
  useGamification: () => ({
    xp: { level: 3, xpIntoLevel: 40, xpForLevelSpan: 500, titleKey: 'level.title.3' },
  }),
}));
vi.mock('../../../shared/features', () => ({
  canAccessFeature: (...a: unknown[]) => h.canAccess(...a),
}));

import { Sidebar } from './Sidebar';

const USER = { name: 'Ada', email: 'ada@example.com', role: 'USER', avatarUrl: null };

function renderSidebar(path = '/', onNavigate = vi.fn()) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Sidebar state="open" onNavigate={onNavigate} />
    </MemoryRouter>,
  );
  return onNavigate;
}

beforeEach(() => {
  vi.clearAllMocks();
  h.canAccess.mockReturnValue(true);
  h.auth = { user: null };
  h.messages = { enabled: true, totalUnread: 0 };
  h.logout.mockResolvedValue(undefined);
});

describe('Sidebar', () => {
  it('shows the public sections and a sign in link to guests', () => {
    renderSidebar();
    for (const label of ['Dashboard', 'Courses', 'Algorithms', 'Almanac', 'Forum', 'Sign in']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    }
    expect(screen.queryByText('Messages')).toBeNull();
    expect(screen.queryByText('Settings')).toBeNull();
  });

  it('never links to the Laniakea explorer', () => {
    h.auth = { user: USER };
    renderSidebar();
    expect(screen.queryByText(/Laniakea/)).toBeNull();
  });

  it('marks the current section', () => {
    renderSidebar('/courses');
    expect(screen.getByRole('link', { name: 'Courses' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current');
  });

  it('counts an algorithm lesson as Algorithms and a course lesson as Courses', () => {
    renderSidebar('/lesson/algo-python/sum');
    expect(screen.getByRole('link', { name: 'Algorithms' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Courses' })).not.toHaveAttribute('aria-current');
  });

  it('counts a main course lesson as Courses', () => {
    renderSidebar('/lesson/python/booleans');
    expect(screen.getByRole('link', { name: 'Courses' })).toHaveAttribute('aria-current', 'page');
  });

  it('reports navigation so the drawer can close', () => {
    const onNavigate = renderSidebar();
    fireEvent.click(screen.getByRole('link', { name: 'Forum' }));
    expect(onNavigate).toHaveBeenCalled();
  });

  it('shows community features and the unread count to a signed in user', () => {
    h.auth = { user: USER };
    h.messages = { enabled: true, totalUnread: 12 };
    renderSidebar();
    expect(screen.getByRole('link', { name: /Messages/ })).toHaveTextContent('9+');
    expect(screen.getByRole('link', { name: 'Leaderboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Connections' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Support' })).toBeInTheDocument();
  });

  it('keeps gated features in place but leads nowhere', () => {
    h.auth = { user: USER };
    h.messages = { enabled: false, totalUnread: 0 };
    h.canAccess.mockReturnValue(false);
    renderSidebar();
    expect(screen.queryByRole('link', { name: /Messages|Leaderboard|Connections/ })).toBeNull();
    expect(screen.getAllByText('Coming soon')).toHaveLength(3);
  });

  it('opens the account menu and navigates from it', () => {
    h.auth = { user: USER };
    const onNavigate = renderSidebar();
    fireEvent.click(screen.getByRole('button', { name: /Ada/ }));
    const menu = screen.getByRole('menu');
    expect(within(menu).getByText('ada@example.com')).toBeInTheDocument();
    expect(within(menu).queryByText('Admin Dashboard')).toBeNull();
    fireEvent.click(within(menu).getByText('Profile'));
    expect(h.navigate).toHaveBeenCalledWith('/profile');
    expect(onNavigate).toHaveBeenCalled();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('shows the admin entry to admins', () => {
    h.auth = { user: { ...USER, role: 'ADMIN' } };
    renderSidebar();
    fireEvent.click(screen.getByRole('button', { name: /Ada/ }));
    fireEvent.click(screen.getByText('Admin Dashboard'));
    expect(h.navigate).toHaveBeenCalledWith('/admin');
  });

  it('signs out and returns to the sign in page', async () => {
    h.auth = { user: USER };
    renderSidebar();
    fireEvent.click(screen.getByRole('button', { name: /Ada/ }));
    fireEvent.click(screen.getByText('Sign out'));
    await Promise.resolve();
    expect(h.logout).toHaveBeenCalled();
    expect(h.navigate).toHaveBeenCalledWith('/getstarted');
  });

  it('closes the account menu on Escape and on an outside click', () => {
    h.auth = { user: USER };
    renderSidebar();
    const trigger = screen.getByRole('button', { name: /Ada/ });
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: 'a' });
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();

    fireEvent.click(trigger);
    fireEvent.mouseDown(screen.getByRole('menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
