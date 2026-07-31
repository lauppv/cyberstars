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

  it('falls back to a generic message when the failure carries none', async () => {
    h.service.getHint.mockRejectedValue('nope');
    renderModal();
    fireEvent.click(screen.getByText('Get hint'));
    await waitFor(() =>
      expect(screen.getByText('Could not get a hint right now.')).toBeInTheDocument(),
    );
  });

  it('retries the same level after a failure', async () => {
    h.service.getHint.mockRejectedValueOnce(new Error('gemini down')).mockResolvedValue({
      hint: 'think about the loop',
      level: 1,
      maxLevel: 3,
      usage: summary({ used: 1, remaining: 9 }),
    });
    renderModal();
    fireEvent.click(screen.getByText('Get hint'));
    await waitFor(() => expect(screen.getByText('Try again')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Try again'));

    await waitFor(() => expect(screen.getByText('think about the loop')).toBeInTheDocument());
    expect(h.service.getHint).toHaveBeenLastCalledWith('python', 'vars', 'x=1', 1, 'en');
  });

  it('hides the retry button once the budget is spent', async () => {
    h.service.getHint.mockRejectedValue(new Error('gemini down'));
    const { rerender } = renderModal();

    fireEvent.click(screen.getByText('Get hint'));
    await waitFor(() => expect(screen.getByText('Try again')).toBeInTheDocument());

    h.usage.summary = summary({ used: 10, remaining: 0 });
    rerender(
      <HintModal courseKey="python" lessonSlug="vars" code="x=1" lang="en" onClose={vi.fn()} />,
    );

    expect(screen.getByText('gemini down')).toBeInTheDocument();
    expect(screen.queryByText('Try again')).not.toBeInTheDocument();
  });

  it('escalates through the three levels and then stops offering more', async () => {
    let level = 0;
    h.service.getHint.mockImplementation(async () => ({
      hint: `hint ${++level}`,
      level,
      maxLevel: 3,
      usage: summary({ used: level, remaining: 10 - level }),
    }));
    renderModal();

    fireEvent.click(screen.getByText('Get hint'));
    await waitFor(() => expect(screen.getByText('hint 1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('More specific hint'));
    await waitFor(() => expect(screen.getByText('hint 2')).toBeInTheDocument());

    fireEvent.click(screen.getByText('More specific hint'));
    await waitFor(() => expect(screen.getByText('hint 3')).toBeInTheDocument());

    expect(screen.queryByText('More specific hint')).not.toBeInTheDocument();
    expect(screen.getByText("That's the most detailed hint.")).toBeInTheDocument();
    expect(h.service.getHint).toHaveBeenLastCalledWith('python', 'vars', 'x=1', 3, 'en');
  });

  it('hides the usage meter when there is no summary yet', () => {
    h.usage.summary = null;
    renderModal();
    expect(screen.getByText('Get hint')).toBeEnabled();
  });
});

describe('HintModal dismissal', () => {
  function renderWithClose(onClose: () => void) {
    return render(
      <HintModal courseKey="python" lessonSlug="vars" code="x=1" lang="en" onClose={onClose} />,
    );
  }

  it('closes on the header button and on the backdrop', () => {
    const onClose = vi.fn();
    const { container } = renderWithClose(onClose);

    fireEvent.click(screen.getByLabelText('Close'));
    fireEvent.mouseDown(container.firstChild!);

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('stays open when the click lands inside the dialog', () => {
    const onClose = vi.fn();
    renderWithClose(onClose);

    fireEvent.mouseDown(screen.getByText('Get hint'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes on Escape and stops listening once unmounted', () => {
    const onClose = vi.fn();
    const { unmount } = renderWithClose(onClose);

    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();

    unmount();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
