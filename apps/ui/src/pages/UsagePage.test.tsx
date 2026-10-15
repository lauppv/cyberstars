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
import { PREVIEW_FEATURES } from '@cyberstars/shared/features';

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
  };

  it('shows each allowance as a share used, with its window', () => {
    mockUsage = { loading: false, summary };
    renderPage();
    expect(screen.getByRole('heading', { name: 'Usage' })).toBeInTheDocument();
    expect(screen.getByText('Show Solution')).toBeInTheDocument();
    expect(screen.getByText('Tutor messages')).toBeInTheDocument();
    expect(screen.getByText('33% used')).toBeInTheDocument();
    expect(screen.getByText('90% used')).toBeInTheDocument();
    expect(screen.getByText('· 24 hours', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('· 5 hours', { exact: false })).toBeInTheDocument();
  });

  it('shows the tutor session to every signed-in student on prod', () => {
    vi.stubEnv('PROD', true);
    mockUsage = { loading: false, summary };
    renderPage();
    expect(screen.getByText('Tutor messages')).toBeInTheDocument();
    vi.unstubAllEnvs();
  });

  it('leaves the tutor out for a student who cannot open it', () => {
    // Force the tutor back into preview: on prod only admins get it then
    const original = PREVIEW_FEATURES.tutorChat;
    PREVIEW_FEATURES.tutorChat = true;
    vi.stubEnv('PROD', true);
    mockUsage = { loading: false, summary };
    renderPage();
    expect(screen.queryByText('Tutor messages')).not.toBeInTheDocument();
    expect(screen.getByText('Show Solution')).toBeInTheDocument();
    vi.unstubAllEnvs();
    PREVIEW_FEATURES.tutorChat = original;
  });
});
