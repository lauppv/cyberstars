import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

const mockNavigate = vi.fn();
let mockLocation = { pathname: '/' };
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

let mockAuthState: { isLoggedIn: boolean; user: { name: string } | null } = {
  isLoggedIn: true,
  user: { name: 'Test' },
};
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthState,
}));

vi.mock('./NotificationBell', () => ({
  NotificationBell: () => <div data-testid="bell" />,
}));

let mockSidebar: { state: 'open' | 'wide' | 'closed'; toggle: () => void } | null = null;
vi.mock('./AppShell', () => ({
  useSidebar: () => mockSidebar,
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
  vi.clearAllMocks();
  mockLocation = { pathname: '/' };
  mockAuthState = { isLoggedIn: true, user: { name: 'Test' } };
  mockSidebar = null;
});

describe('Topbar', () => {
  it('names the current section when there is no breadcrumb', () => {
    renderTopbar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('matches the section by path prefix', () => {
    mockLocation = { pathname: '/forum/t/12' };
    renderTopbar();
    expect(screen.getByText('Forum')).toBeInTheDocument();
  });

  it('shows no title on a route it does not know', () => {
    mockLocation = { pathname: '/u/5' };
    const { container } = renderTopbar();
    expect(container.querySelector('header span')).toBeNull();
  });

  it('renders breadcrumb when provided', () => {
    renderTopbar({ breadcrumb: { course: 'Python', lesson: 'Booleans' } });
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Booleans')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
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

  it('renders the lesson list toggle when showSidebarToggle is true', () => {
    const onToggle = vi.fn();
    renderTopbar({ showSidebarToggle: true, sidebarOpen: true, onSidebarToggle: onToggle });
    const btn = screen.getByLabelText('Toggle sidebar');
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalled();
  });

  it('has no sidebar button outside the app shell', () => {
    renderTopbar();
    expect(screen.queryByLabelText('Hide sidebar')).toBeNull();
    expect(screen.queryByLabelText('Show sidebar')).toBeNull();
  });

  it('toggles the app sidebar inside the shell', () => {
    const toggle = vi.fn();
    mockSidebar = { state: 'wide', toggle };
    renderTopbar();
    fireEvent.click(screen.getByLabelText('Hide sidebar'));
    expect(toggle).toHaveBeenCalled();
  });

  it('offers to show a closed sidebar', () => {
    mockSidebar = { state: 'closed', toggle: vi.fn() };
    renderTopbar();
    expect(screen.getByLabelText('Show sidebar')).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the notification bell when logged in', () => {
    renderTopbar();
    expect(screen.getByTestId('bell')).toBeInTheDocument();
    expect(screen.queryByText('Sign in')).toBeNull();
  });

  it('shows Sign in button when not logged in', () => {
    mockAuthState = { isLoggedIn: false, user: null };
    renderTopbar();
    fireEvent.click(screen.getByText('Sign in'));
    expect(mockNavigate).toHaveBeenCalledWith('/getstarted');
  });
});
