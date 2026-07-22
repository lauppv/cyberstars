import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import type { UsageSummary } from '../../shared/usage';

const h = vi.hoisted(() => ({
  auth: { isLoggedIn: true },
  service: { getUsage: vi.fn() },
}));

vi.mock('./AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('../services/usageService', () => h.service);

import { UsageProvider, useUsage } from './UsageContext';

function summary(over: Partial<UsageSummary> = {}): UsageSummary {
  return {
    showSolution: { used: 1, limit: 3, remaining: 2, resetAt: null, unlimited: false },
    getHint: { used: 0, limit: 10, remaining: 10, resetAt: null, unlimited: false },
    ...over,
  };
}

function Probe() {
  const { summary: s, loading, refresh, applySummary } = useUsage();
  return (
    <div>
      <span data-testid="sol">{s ? s.showSolution.used : 'none'}</span>
      <span data-testid="loading">{String(loading)}</span>
      <button onClick={refresh}>refresh</button>
      <button
        onClick={() =>
          applySummary(
            summary({
              showSolution: { used: 3, limit: 3, remaining: 0, resetAt: null, unlimited: false },
            }),
          )
        }
      >
        apply
      </button>
    </div>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  h.auth.isLoggedIn = true;
});

describe('UsageContext', () => {
  it('loads the summary on mount when logged in', async () => {
    h.service.getUsage.mockResolvedValue(summary());
    render(
      <UsageProvider>
        <Probe />
      </UsageProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('sol').textContent).toBe('1'));
    expect(h.service.getUsage).toHaveBeenCalled();
  });

  it('does not fetch when logged out and keeps summary null', async () => {
    h.auth.isLoggedIn = false;
    render(
      <UsageProvider>
        <Probe />
      </UsageProvider>,
    );
    expect(h.service.getUsage).not.toHaveBeenCalled();
    expect(screen.getByTestId('sol').textContent).toBe('none');
  });

  it('applySummary replaces the current summary', async () => {
    h.service.getUsage.mockResolvedValue(summary());
    render(
      <UsageProvider>
        <Probe />
      </UsageProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('sol').textContent).toBe('1'));
    act(() => {
      fireEvent.click(screen.getByText('apply'));
    });
    expect(screen.getByTestId('sol').textContent).toBe('3');
  });

  it('swallows fetch errors', async () => {
    h.service.getUsage.mockRejectedValue(new Error('boom'));
    render(
      <UsageProvider>
        <Probe />
      </UsageProvider>,
    );
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('sol').textContent).toBe('none');
  });

  it('throws when useUsage is used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/UsageProvider/);
    spy.mockRestore();
  });
});
