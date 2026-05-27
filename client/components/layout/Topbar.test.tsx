import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLogout = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    isLoggedIn: true,
    user: { name: 'Test', email: 'test@test.com', avatarUrl: null },
    logout: mockLogout,
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

  it('navigates to profile when Profile is clicked', () => {
    renderTopbar();
    fireEvent.click(screen.getByText('Test'));
    fireEvent.click(screen.getByText('Profile'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('closes menu on Escape', () => {
    renderTopbar();
    fireEvent.click(screen.getByText('Test'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('navigates to dashboard on logo click', () => {
    renderTopbar();
    fireEvent.click(screen.getByText('CyberStars'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
