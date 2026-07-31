import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { UsageSummary } from '../../../shared/usage';

const h = vi.hoisted(() => ({
  auth: { isLoggedIn: true },
  usage: {
    summary: null as UsageSummary | null,
    applySummary: vi.fn(),
    loading: false,
    refresh: vi.fn(),
  },
  service: { consumeSolution: vi.fn() },
}));

vi.mock('../../context/AuthContext', () => ({ useAuth: () => h.auth }));
vi.mock('../../context/UsageContext', () => ({ useUsage: () => h.usage }));
vi.mock('../../services/usageService', () => h.service);

import { SolutionConfirmModal } from './SolutionConfirmModal';

function fullSummary(over: Partial<UsageSummary['showSolution']> = {}): UsageSummary {
  return {
    showSolution: { used: 1, limit: 3, remaining: 2, resetAt: null, unlimited: false, ...over },
    getHint: { used: 0, limit: 10, remaining: 10, resetAt: null, unlimited: false },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  h.auth.isLoggedIn = true;
  h.usage.summary = fullSummary();
});

describe('SolutionConfirmModal', () => {
  it('consumes and confirms for a logged-in person', async () => {
    const next = fullSummary({ used: 2, remaining: 1 });
    h.service.consumeSolution.mockResolvedValue(next);
    const onConfirmed = vi.fn();
    render(<SolutionConfirmModal onConfirmed={onConfirmed} onClose={vi.fn()} />);

    expect(screen.getByText('1/3')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Reveal solution'));

    await waitFor(() => expect(onConfirmed).toHaveBeenCalled());
    expect(h.service.consumeSolution).toHaveBeenCalled();
    expect(h.usage.applySummary).toHaveBeenCalledWith(next);
  });

  it('confirms guests without any server call', () => {
    h.auth.isLoggedIn = false;
    h.usage.summary = null;
    const onConfirmed = vi.fn();
    render(<SolutionConfirmModal onConfirmed={onConfirmed} onClose={vi.fn()} />);

    fireEvent.click(screen.getByText('Reveal solution'));
    expect(onConfirmed).toHaveBeenCalled();
    expect(h.service.consumeSolution).not.toHaveBeenCalled();
  });

  it('disables reveal and warns when the daily cap is hit', () => {
    h.usage.summary = fullSummary({ used: 3, remaining: 0 });
    render(<SolutionConfirmModal onConfirmed={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText('Reveal solution')).toBeDisabled();
    expect(screen.getByText(/used all your solution reveals/i)).toBeInTheDocument();
  });

  it('shows an error when the reveal request fails', async () => {
    h.service.consumeSolution.mockRejectedValue(new Error('nope'));
    render(<SolutionConfirmModal onConfirmed={vi.fn()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('Reveal solution'));
    await waitFor(() => expect(screen.getByText('nope')).toBeInTheDocument());
  });

  it('falls back to a generic message when the failure carries none', async () => {
    h.service.consumeSolution.mockRejectedValue('nope');
    render(<SolutionConfirmModal onConfirmed={vi.fn()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('Reveal solution'));
    await waitFor(() =>
      expect(screen.getByText('Could not reveal the solution right now.')).toBeInTheDocument(),
    );
  });

  it('closes on cancel', () => {
    const onClose = vi.fn();
    render(<SolutionConfirmModal onConfirmed={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on the backdrop but not on a click inside the dialog', () => {
    const onClose = vi.fn();
    const { container } = render(<SolutionConfirmModal onConfirmed={vi.fn()} onClose={onClose} />);

    fireEvent.mouseDown(screen.getByText('Cancel'));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.mouseDown(container.firstChild!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes on Escape and stops listening once unmounted', () => {
    const onClose = vi.fn();
    const { unmount } = render(<SolutionConfirmModal onConfirmed={vi.fn()} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();

    unmount();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
