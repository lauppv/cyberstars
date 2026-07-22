import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

let mockLocation = { pathname: '/' };

const mockLogout = vi.fn();
let mockAuthState: {
  isLoggedIn: boolean;
  user: { name: string; email: string; avatarUrl: string | null } | null;
} = {
  isLoggedIn: true,
  user: { name: 'Test', email: 'test@test.com', avatarUrl: null },
};

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ ...mockAuthState, logout: mockLogout }),
}));

vi.mock('../../context/NotificationContext', () => ({
  useNotifications: () => ({
    enabled: false,
    items: [],
    unreadCount: 0,
    loading: false,
    hasMore: false,
    loadMore: vi.fn(),
    markAllRead: vi.fn(),
    markOneRead: vi.fn(),
  }),
}));

vi.mock('../../context/MessagesContext', () => ({
  useMessages: () => ({ enabled: false, totalUnread: 0 }),
}));

vi.mock('../../hooks/useGamification', () => ({
  useGamification: () => ({
    xp: {
      earnedXp: 120,
      totalXp: 8000,
      level: 2,
      titleKey: 'level.title.2',
      xpIntoLevel: 20,
      xpForLevelSpan: 300,
      xpPct: 7,
    },
  }),
}));

import { Topbar } from './Topbar';

function renderTopbar(props = {}) {
  return render(
    <MemoryRouter>
      <Topbar {...props} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockLocation = { pathname: '/' };
  mockAuthState = {
    isLoggedIn: true,
    user: { name: 'Test', email: 'test@test.com', avatarUrl: null },
  };
});

describe('Topbar', () => {
  it('renders the logo and nav items', () => {
    renderTopbar();
    expect(screen.getByText('CyberStars')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText('Algorithms')).toBeInTheDocument();
    expect(screen.getByText('Forum')).toBeInTheDocument();
    expect(screen.getByText('Almanac')).toBeInTheDocument();
  });

  it('renders breadcrumb when provided', () => {
    renderTopbar({ breadcrumb: { course: 'Python', lesson: 'Booleans' } });
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Booleans')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
  });

  it('renders sidebar toggle when showSidebarToggle is true', () => {
    const onToggle = vi.fn();
    renderTopbar({ showSidebarToggle: true, sidebarOpen: true, onSidebarToggle: onToggle });
    const btn = screen.getByLabelText('Toggle sidebar');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalled();
  });

  it('shows user name and opens menu on click', () => {
    renderTopbar();
    expect(screen.getByText('Test')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Test'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('navigates to usage when Daily usage is clicked', () => {
    renderTopbar();
    fireEvent.click(screen.getByText('Test'));
    fireEvent.click(screen.getByText('Daily usage'));
    expect(mockNavigate).toHaveBeenCalledWith('/usage');
  });

  it('navigates to profile when Profile is clicked', () => {
    renderTopbar();
    fireEvent.click(screen.getByText('Test'));
    fireEvent.click(screen.getByText('Profile'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('navigates to settings when Settings is clicked', () => {
    renderTopbar();
    fireEvent.click(screen.getByText('Test'));
    fireEvent.click(screen.getByText('Settings'));
    expect(mockNavigate).toHaveBeenCalledWith('/settings');
  });

  it('closes menu on Escape', () => {
    renderTopbar();
    fireEvent.click(screen.getByText('Test'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('keeps the user menu open when clicking inside it', () => {
    renderTopbar();
    fireEvent.click(screen.getByText('Test'));
    const menu = screen.getByRole('menu');
    fireEvent.mouseDown(menu);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('ignores non-Escape keys while the user menu is open', () => {
    renderTopbar();
    fireEvent.click(screen.getByText('Test'));
    fireEvent.keyDown(document, { key: 'a' });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('navigates to dashboard on logo click', () => {
    renderTopbar();
    fireEvent.click(screen.getByText('CyberStars'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates from menu items: Support, Rules, Welcome Tour, and Sign out', async () => {
    mockLogout.mockResolvedValue(undefined);
    renderTopbar();
    fireEvent.click(screen.getByText('Test'));

    fireEvent.click(screen.getByText('Support'));
    expect(mockNavigate).toHaveBeenCalledWith('/support');

    fireEvent.click(screen.getByText('Test'));
    fireEvent.click(screen.getByText('Rules'));
    expect(mockNavigate).toHaveBeenCalledWith('/rules');

    fireEvent.click(screen.getByText('Test'));
    fireEvent.click(screen.getByText('Welcome Tour'));
    expect(mockNavigate).toHaveBeenCalledWith('/welcome');

    fireEvent.click(screen.getByText('Test'));
    fireEvent.click(screen.getByText('Sign out'));
    // logout() returns a promise; wait a microtask for navigate('/getstarted') to fire
    await Promise.resolve();
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/getstarted');
  });

  it('shows Sign in button when not logged in', () => {
    mockAuthState = { isLoggedIn: false, user: null };
    renderTopbar();
    const signIn = screen.getByText('Sign in');
    fireEvent.click(signIn);
    expect(mockNavigate).toHaveBeenCalledWith('/getstarted');
  });

  it('renders avatar image when user has avatarUrl', () => {
    mockAuthState = {
      isLoggedIn: true,
      user: { name: 'Test', email: 'test@test.com', avatarUrl: '/uploads/a.png' },
    };
    renderTopbar();
    const img = document.querySelector('img[src="/uploads/a.png"]');
    expect(img).not.toBeNull();
  });

  it('closes menu when clicking outside', () => {
    renderTopbar();
    fireEvent.click(screen.getByText('Test'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('marks Algorithms active on /algorithms and /lesson/algo-* paths', () => {
    mockLocation = { pathname: '/lesson/algo-python/sum' };
    renderTopbar();
    const algBtn = screen.getByText('Algorithms');
    expect(algBtn.className).toMatch(/text-\[var\(--accent\)\]/);
  });

  it('marks Courses active on /courses paths', () => {
    mockLocation = { pathname: '/courses/python' };
    renderTopbar();
    const btn = screen.getByText('Courses');
    expect(btn.className).toMatch(/text-\[var\(--accent\)\]/);
  });

  it('navigates via nav buttons', () => {
    renderTopbar();
    fireEvent.click(screen.getByText('Forum'));
    expect(mockNavigate).toHaveBeenCalledWith('/forum');
  });

  it('breadcrumb course click navigates to courseHref when provided', () => {
    renderTopbar({ breadcrumb: { course: 'Python', courseHref: '/courses/python' } });
    fireEvent.click(screen.getByText('Python'));
    expect(mockNavigate).toHaveBeenCalledWith('/courses/python');
  });

  it('breadcrumb course click falls back to /courses without courseHref', () => {
    renderTopbar({ breadcrumb: { course: 'Python' } });
    fireEvent.click(screen.getByText('Python'));
    expect(mockNavigate).toHaveBeenCalledWith('/courses');
  });

  it('opens mobile nav via hamburger and navigates from it', () => {
    renderTopbar();
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    const menu = screen.getByRole('menu');
    fireEvent.click(within(menu).getByText('Forum'));
    expect(mockNavigate).toHaveBeenCalledWith('/forum');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('toggles the mobile nav closed when the hamburger is clicked again', () => {
    renderTopbar();
    const btn = screen.getByLabelText('Toggle menu');
    fireEvent.click(btn);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.click(btn);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes the mobile nav on Escape', () => {
    renderTopbar();
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('ignores non-Escape keys while the mobile nav is open', () => {
    renderTopbar();
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    fireEvent.keyDown(document, { key: 'a' });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closes the mobile nav when clicking outside', () => {
    renderTopbar();
    fireEvent.click(screen.getByLabelText('Toggle menu'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('keeps the mobile nav open when clicking inside it', () => {
    renderTopbar();
    const btn = screen.getByLabelText('Toggle menu');
    fireEvent.click(btn);
    const menu = screen.getByRole('menu');
    fireEvent.mouseDown(menu);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('sidebar toggle arrow flips with sidebarOpen prop', () => {
    const { rerender } = renderTopbar({
      showSidebarToggle: true,
      sidebarOpen: true,
      onSidebarToggle: vi.fn(),
    });
    expect(screen.getByLabelText('Toggle sidebar').textContent).toBe('◀');

    rerender(
      <MemoryRouter>
        <Topbar showSidebarToggle sidebarOpen={false} onSidebarToggle={vi.fn()} />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Toggle sidebar').textContent).toBe('▶');
  });
});
