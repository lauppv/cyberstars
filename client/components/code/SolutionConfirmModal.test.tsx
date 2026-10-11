import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { UsageSummary } from '@cyberstars/shared/usage';

const h = vi.hoisted(() => ({
  usage: {
    summary: null as UsageSummary | null,
    applySummary: vi.fn(),
    loading: false,
    refresh: vi.fn(),
  },
  service: { revealSolution: vi.fn() },
}));

vi.mock('../../context/UsageContext', () => ({ useUsage: () => h.usage }));
vi.mock('../../services/usageService', () => h.service);

import { SolutionConfirmModal } from './SolutionConfirmModal';

const LESSON = { courseKey: 'python', lessonSlug: 'loops', lang: 'en' } as const;

function fullSummary(over: Partial<UsageSummary['showSolution']> = {}): UsageSummary {
  return {
    showSolution: { used: 1, limit: 3, remaining: 2, resetAt: null, unlimited: false, ...over },
    getHint: { used: 0, limit: 10, remaining: 10, resetAt: null, unlimited: false },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  h.usage.summary = fullSummary();
});

describe('SolutionConfirmModal', () => {
  it('spends a reveal and hands back the solution', async () => {
    const next = fullSummary({ used: 2, remaining: 1 });
    h.service.revealSolution.mockResolvedValue({ solution: '```py\nprint(1)\n```', usage: next });
    const onConfirmed = vi.fn();
    render(<SolutionConfirmModal {...LESSON} onConfirmed={onConfirmed} onClose={vi.fn()} />);

    expect(screen.getByText('1/3')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Reveal solution'));

    await waitFor(() => expect(onConfirmed).toHaveBeenCalledWith('```py\nprint(1)\n```'));
    expect(h.service.revealSolution).toHaveBeenCalledWith('python', 'loops', 'en');
    expect(h.usage.applySummary).toHaveBeenCalledWith(next);
  });

  it('disables reveal and warns when the daily cap is hit', () => {
    h.usage.summary = fullSummary({ used: 3, remaining: 0 });
    render(<SolutionConfirmModal {...LESSON} onConfirmed={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText('Reveal solution')).toBeDisabled();
    expect(screen.getByText(/used all your solution reveals/i)).toBeInTheDocument();
  });

  it('shows an error when the reveal request fails', async () => {
    h.service.revealSolution.mockRejectedValue(new Error('nope'));
    render(<SolutionConfirmModal {...LESSON} onConfirmed={vi.fn()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('Reveal solution'));
    await waitFor(() => expect(screen.getByText('nope')).toBeInTheDocument());
  });

  it('falls back to a generic message when the failure carries none', async () => {
    h.service.revealSolution.mockRejectedValue('nope');
    render(<SolutionConfirmModal {...LESSON} onConfirmed={vi.fn()} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('Reveal solution'));
    await waitFor(() =>
      expect(screen.getByText('Could not reveal the solution right now.')).toBeInTheDocument(),
    );
  });

  it('closes on cancel', () => {
    const onClose = vi.fn();
    render(<SolutionConfirmModal {...LESSON} onConfirmed={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on the backdrop but not on a click inside the dialog', () => {
    const onClose = vi.fn();
    const { container } = render(
      <SolutionConfirmModal {...LESSON} onConfirmed={vi.fn()} onClose={onClose} />,
    );

    fireEvent.mouseDown(screen.getByText('Cancel'));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.mouseDown(container.firstChild!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes on Escape and stops listening once unmounted', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <SolutionConfirmModal {...LESSON} onConfirmed={vi.fn()} onClose={onClose} />,
    );

    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();

    unmount();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
