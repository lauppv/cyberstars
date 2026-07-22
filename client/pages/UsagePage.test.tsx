import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../components/layout/Topbar', () => ({
  Topbar: () => <nav data-testid="topbar">Topbar</nav>,
}));

const mockRefresh = vi.fn();
let mockAuth = { isLoggedIn: true };
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
  mockAuth = { isLoggedIn: true };
  mockUsage = { summary: null, loading: false };
});

describe('UsagePage', () => {
  it('shows a sign-in prompt when logged out', () => {
    mockAuth = { isLoggedIn: false };
    renderPage();
    expect(screen.getByText('Sign in to see your daily usage.')).toBeInTheDocument();
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

  it('renders both usage meters when a summary is present', () => {
    mockUsage = {
      loading: false,
      summary: {
        showSolution: { used: 1, limit: 3, remaining: 2, resetAt: null, unlimited: false },
        getHint: { used: 4, limit: 10, remaining: 6, resetAt: null, unlimited: false },
      },
    };
    renderPage();
    expect(screen.getByText('Show Solution')).toBeInTheDocument();
    expect(screen.getByText('AI hints')).toBeInTheDocument();
    expect(screen.getByText('1/3')).toBeInTheDocument();
    expect(screen.getByText('4/10')).toBeInTheDocument();
  });
});
