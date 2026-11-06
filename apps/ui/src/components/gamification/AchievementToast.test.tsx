import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { AchievementToast } from './AchievementToast';

afterEach(() => {
  vi.useRealTimers();
});

describe('AchievementToast', () => {
  it('renders nothing while hidden', () => {
    render(<AchievementToast title="+10 XP" visible={false} onClose={vi.fn()} />);
    expect(screen.queryByText('+10 XP')).toBeNull();
  });

  it('closes on its button and by itself after a few seconds', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<AchievementToast title="+10 XP" visible onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(5000));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("stacks a lesson's XP and the badge it earns in the corner", () => {
    render(
      <>
        <AchievementToast title="+10 XP" visible onClose={vi.fn()} />
        <AchievementToast title="Badge earned: First Steps" visible onClose={vi.fn()} />
      </>,
    );
    const corner = document.getElementById('corner')!;
    const xp = screen.getByText('+10 XP').closest('#corner > div');
    const badge = screen.getByText('Badge earned: First Steps').closest('#corner > div');
    expect(corner).toContainElement(xp as HTMLElement);
    expect(corner).toContainElement(badge as HTMLElement);
    expect(xp).not.toBe(badge);
  });

  it('draws the badge it announces, and none for XP', () => {
    const { container, rerender } = render(
      <AchievementToast title="+10 XP" visible onClose={vi.fn()} />,
    );
    expect(container.ownerDocument.querySelector('#corner svg')).toBeNull();
    rerender(
      <AchievementToast
        title="Badge earned: Python Gold"
        visible
        onClose={vi.fn()}
        badge={{ courseKey: 'python', level: 3 }}
      />,
    );
    expect(container.ownerDocument.querySelector('#corner svg')).not.toBeNull();
  });

  it('keeps its timer when the page renders again with a new onClose', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const { rerender } = render(
      <AchievementToast title="+10 XP" visible onClose={() => onClose()} />,
    );
    act(() => vi.advanceTimersByTime(3000));
    rerender(<AchievementToast title="+10 XP" visible onClose={() => onClose()} />);
    act(() => vi.advanceTimersByTime(2000));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
