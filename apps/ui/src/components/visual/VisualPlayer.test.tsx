import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VisualPlayer } from './VisualPlayer';
import type { ArrayVisual } from './parseVisual';

const visual: ArrayVisual = {
  type: 'array',
  values: [5, 3, 8],
  caption: 'Start',
  steps: [
    { compare: [0, 1], swap: true, caption: 'Swap 5 and 3' },
    { compare: [1, 2], sorted: 2, caption: '5 < 8, ok, 8 is in place' },
  ],
};

const box = (container: HTMLElement, id: number) =>
  container.querySelector<HTMLElement>(`[data-box="${id}"]`)!;

describe('VisualPlayer', () => {
  it('opens on the starting array and its caption, in a live region', () => {
    const { container } = render(<VisualPlayer visual={visual} />);
    expect(screen.getByText('Start')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    expect(box(container, 0)).toHaveTextContent('5');
    expect(box(container, 0).style.transform).toBe('translateX(calc(0 * (100% + 8px)))');
    expect(box(container, 0)).toHaveAttribute('data-state', 'idle');
  });

  it('steps forward with Next: the compared boxes light up and a swap moves them', () => {
    const { container } = render(<VisualPlayer visual={visual} />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Swap 5 and 3')).toBeInTheDocument();
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    expect(box(container, 0).style.transform).toBe('translateX(calc(1 * (100% + 8px)))');
    expect(box(container, 1).style.transform).toBe('translateX(calc(0 * (100% + 8px)))');
    expect(box(container, 0)).toHaveAttribute('data-state', 'compared');
    expect(box(container, 1)).toHaveAttribute('data-state', 'compared');
    expect(box(container, 2)).toHaveAttribute('data-state', 'idle');
  });

  it('marks the sorted end, over a comparison on it', () => {
    const { container } = render(<VisualPlayer visual={visual} />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(box(container, 0)).toHaveAttribute('data-state', 'compared');
    expect(box(container, 2)).toHaveAttribute('data-state', 'sorted');
  });

  it('stops at both ends, with the buttons marked disabled but still focusable', () => {
    render(<VisualPlayer visual={visual} />);
    const previous = screen.getByRole('button', { name: /previous/i });
    const next = screen.getByRole('button', { name: /next/i });
    expect(previous).toHaveAttribute('aria-disabled', 'true');
    expect(previous).not.toBeDisabled();
    fireEvent.click(previous);
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    fireEvent.click(next);
    fireEvent.click(next);
    fireEvent.click(next);
    expect(screen.getByText('Step 3 of 3')).toBeInTheDocument();
    expect(next).toHaveAttribute('aria-disabled', 'true');
  });

  it('goes back with Previous and to the start with Start over', () => {
    render(<VisualPlayer visual={visual} />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getByText('Swap 5 and 3')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start over' }));
    expect(screen.getByText('Start')).toBeInTheDocument();
  });

  it('steps with the arrow keys while focused and leaves other keys alone', () => {
    render(<VisualPlayer visual={visual} />);
    const player = screen.getByRole('group', { name: 'Step by step' });
    expect(player).toHaveAttribute('tabindex', '0');
    expect(fireEvent.keyDown(player, { key: 'ArrowRight' })).toBe(false);
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    fireEvent.keyDown(player, { key: 'ArrowLeft' });
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    expect(fireEvent.keyDown(player, { key: 'Enter' })).toBe(true);
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
  });

  it('turns the slide off under reduced motion', () => {
    const { container } = render(<VisualPlayer visual={visual} />);
    expect(box(container, 0)).toHaveClass('transition-transform', 'motion-reduce:transition-none');
  });
});
