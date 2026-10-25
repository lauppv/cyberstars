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
  tutor: { open: false, toggle: vi.fn() },
  progress: { progressMap: {} as Record<string, unknown>, isLoading: false },
}));

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useNavigate: () => h.navigate };
});
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ ...h.auth, logout: h.logout }),
}));
vi.mock('../../context/MessagesContext', () => ({ useMessages: () => h.messages }));
vi.mock('../../context/TutorContext', () => ({ useTutor: () => h.tutor }));
vi.mock('../../context/ProgressContext', () => ({ useAllProgress: () => h.progress }));
vi.mock('../../hooks/useGamification', () => ({
  useGamification: () => ({
    xp: { level: 3, xpIntoLevel: 40, xpForLevelSpan: 500, titleKey: 'level.title.3' },
  }),
}));
vi.mock('@cyberstars/shared/features', () => ({
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
  h.tutor = { open: false, toggle: vi.fn() };
  h.progress = { progressMap: {}, isLoading: false };
  h.logout.mockResolvedValue(undefined);
});

describe('Sidebar', () => {
  it('shows a guest only Courses, Algorithms, the Almanac and a sign in link', () => {
    renderSidebar();
    const links = screen.getAllByRole('link').map((link) => link.textContent);
    expect(links).toEqual(['CyberStars', 'Courses', 'Algorithms', 'Almanac', 'Sign in']);
    expect(screen.queryByText('Community')).toBeNull();
  });

  it('leads a student to Laniakea, saying how many of the first Python lessons still open it', () => {
    h.auth = { user: USER };
    // Four of the first six done; the seventh and eighth count for nothing
    const completed = [true, false, true, true, false, true, true, true];
    h.progress = {
      progressMap: {
        python: { lessons: completed.map((c, i) => ({ slug: `l${i}`, completed: c })) },
      },
      isLoading: false,
    };
    renderSidebar();
    const row = screen.getByRole('link', { name: /Laniakea/ });
    expect(row).toHaveAttribute('href', '/laniakea');
    expect(within(row).getByText('Beta')).toHaveAttribute(
      'title',
      expect.stringMatching(/^Still being built/),
    );
    expect(row).toHaveTextContent('2 lessons to go');
    // Under the name, which keeps its room beside the Beta tag
    const note = within(row).getByText('2 lessons to go');
    expect(note.previousElementSibling).toHaveTextContent(/^LaniakeaBeta$/);
  });

  it('drops the note once the game is open', () => {
    h.auth = { user: USER };
    h.progress = {
      progressMap: {
        python: {
          lessons: [1, 2, 3, 4, 5, 6].map((i) => ({ slug: `l${i}`, completed: true })),
        },
      },
      isLoading: false,
    };
    renderSidebar();
    expect(screen.getByRole('link', { name: /Laniakea/ })).toHaveTextContent(/^LaniakeaBeta$/);
  });

  it('says nothing about lessons left before progress has loaded', () => {
    h.auth = { user: USER };
    h.progress = { progressMap: {}, isLoading: true };
    renderSidebar();
    expect(screen.getByRole('link', { name: /Laniakea/ })).toHaveTextContent(/^LaniakeaBeta$/);
  });

  it('keeps Laniakea from guests', () => {
    renderSidebar();
    expect(screen.queryByText(/Laniakea/)).toBeNull();
  });

  it('marks the current section', () => {
    h.auth = { user: USER };
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
    fireEvent.click(screen.getByRole('link', { name: 'Courses' }));
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
    expect(screen.queryByRole('button', { name: 'Tutor' })).toBeNull();
    expect(screen.getAllByText('Coming soon')).toHaveLength(4);
  });

  it('lists the tutor last in the community group and toggles its panel', () => {
    h.auth = { user: USER };
    const onNavigate = renderSidebar();
    const tutor = screen.getByRole('button', { name: 'Tutor' });
    const leaderboard = screen.getByRole('link', { name: 'Leaderboard' });
    expect(leaderboard.compareDocumentPosition(tutor)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(tutor).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(tutor);
    expect(h.tutor.toggle).toHaveBeenCalled();
    expect(onNavigate).toHaveBeenCalled();
  });

  it('marks the tutor while its panel is open', () => {
    h.auth = { user: USER };
    h.tutor = { open: true, toggle: vi.fn() };
    renderSidebar();
    expect(screen.getByRole('button', { name: 'Tutor' })).toHaveAttribute('aria-pressed', 'true');
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
