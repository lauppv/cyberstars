import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

vi.mock('../components/layout/Topbar', () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));

const mockRefresh = vi.fn();
let mockAuth: { isLoggedIn: boolean; user?: { role: string } } = {
  isLoggedIn: true,
  user: { role: 'USER' },
};
let mockUsage: {
  summary: unknown;
  loading: boolean;
} = { summary: null, loading: false };

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuth,
}));

vi.mock('../context/UsageContext', () => ({
  useUsage: () => ({ ...mockUsage, refresh: mockRefresh }),
}));

import { UsagePage } from './UsagePage';

function renderPage() {
  return render(
    <MemoryRouter>
      <UsagePage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockRefresh.mockClear();
  mockAuth = { isLoggedIn: true, user: { role: 'USER' } };
  mockUsage = { summary: null, loading: false };
});

describe('UsagePage', () => {
  it('shows a sign-in prompt when logged out', () => {
    mockAuth = { isLoggedIn: false };
    renderPage();
    expect(screen.getByText('Sign in to see your usage.')).toBeInTheDocument();
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it('refreshes usage on mount when logged in', () => {
    renderPage();
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('shows a spinner while loading with no summary', () => {
    mockUsage = { summary: null, loading: true };
    const { container } = renderPage();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.queryByText('Show Solution')).not.toBeInTheDocument();
  });

  const summary = {
    showSolution: { used: 1, limit: 3, remaining: 2, resetAt: null, unlimited: false },
    tutorMessage: { used: 27, limit: 30, remaining: 3, resetAt: null, unlimited: false },
    getHint: { used: 4, limit: 10, remaining: 6, resetAt: null, unlimited: false },
  };

  it('shows each allowance as a share used, with its window', () => {
    mockUsage = { loading: false, summary };
    renderPage();
    expect(screen.getByRole('heading', { name: 'Usage' })).toBeInTheDocument();
    expect(screen.getByText('Show Solution')).toBeInTheDocument();
    expect(screen.getByText('Tutor messages')).toBeInTheDocument();
    expect(screen.getByText('AI hints')).toBeInTheDocument();
    expect(screen.getByText('33% used')).toBeInTheDocument();
    expect(screen.getByText('90% used')).toBeInTheDocument();
    expect(screen.getByText('40% used')).toBeInTheDocument();
    expect(screen.getAllByText('· 24 hours', { exact: false })).toHaveLength(2);
    expect(screen.getByText('· 5 hours', { exact: false })).toBeInTheDocument();
  });

  it('leaves the tutor out for a student who cannot open it yet', () => {
    vi.stubEnv('PROD', true);
    mockUsage = { loading: false, summary };
    renderPage();
    expect(screen.queryByText('Tutor messages')).not.toBeInTheDocument();
    expect(screen.getByText('Show Solution')).toBeInTheDocument();
    vi.unstubAllEnvs();
  });
});
