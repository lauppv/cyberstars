import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { UsageSummary } from '../../../shared/usage';

const h = vi.hoisted(() => ({
  usage: {
    summary: null as UsageSummary | null,
    applySummary: vi.fn(),
    loading: false,
    refresh: vi.fn(),
  },
  service: { getHint: vi.fn() },
}));

vi.mock('../../context/UsageContext', () => ({ useUsage: () => h.usage }));
vi.mock('../../services/hintsService', () => h.service);

import { HintModal } from './HintModal';

function summary(over: Partial<UsageSummary['getHint']> = {}): UsageSummary {
  return {
    showSolution: { used: 0, limit: 3, remaining: 3, resetAt: null, unlimited: false },
    getHint: { used: 0, limit: 10, remaining: 10, resetAt: null, unlimited: false, ...over },
  };
}

function renderModal() {
  return render(
    <HintModal courseKey="python" lessonSlug="vars" code="x=1" lang="en" onClose={vi.fn()} />,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  h.usage.summary = summary();
});

describe('HintModal', () => {
  it('does NOT call the AI on open — it waits for a click', () => {
    renderModal();
    expect(h.service.getHint).not.toHaveBeenCalled();
    expect(screen.getByText('Get hint')).toBeInTheDocument();
  });

  it('fetches a hint on click and updates usage', async () => {
    h.service.getHint.mockResolvedValue({
      hint: 'think about the loop',
      level: 1,
      maxLevel: 3,
      usage: summary({ used: 1, remaining: 9 }),
    });
    renderModal();
    fireEvent.click(screen.getByText('Get hint'));
    await waitFor(() => expect(screen.getByText('think about the loop')).toBeInTheDocument());
    expect(h.service.getHint).toHaveBeenCalledWith('python', 'vars', 'x=1', 1, 'en');
    expect(h.usage.applySummary).toHaveBeenCalled();
  });

  it('disables the start button when the budget is empty', () => {
    h.usage.summary = summary({ used: 10, remaining: 0 });
    renderModal();
    expect(screen.getByText('Get hint')).toBeDisabled();
    expect(screen.getByText(/used all your AI hints/i)).toBeInTheDocument();
  });

  it('surfaces an error when the request fails', async () => {
    h.service.getHint.mockRejectedValue(new Error('gemini down'));
    renderModal();
    fireEvent.click(screen.getByText('Get hint'));
    await waitFor(() => expect(screen.getByText('gemini down')).toBeInTheDocument());
  });
});
