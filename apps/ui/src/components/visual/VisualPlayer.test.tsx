import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { VisualPlayer } from './VisualPlayer';
import type { ArrayVisual } from './parseVisual';

const visual: ArrayVisual = {
  type: 'array',
  values: [5, 3, 8],
  caption: 'How it works',
  steps: [
    {
      title: 'Pass 1',
      compare: [0, 1],
      ask: 'Is 5 > 3?',
      swap: true,
      caption: 'Yes, so they swap',
    },
    { sorted: 2, caption: '8 is in place' },
  ],
};

const box = (root: HTMLElement | Document, id: number) =>
  root.querySelector<HTMLElement>(`[data-box="${id}"]`)!;

const player = () => screen.getByRole('group', { name: 'Step by step' });
const next = (root = player()) =>
  fireEvent.click(within(root).getByRole('button', { name: /next/i }));

describe('VisualPlayer', () => {
  it('opens on how the algorithm works, in a live region, with no position numbers', () => {
    render(<VisualPlayer visual={visual} />);
    expect(screen.getByText('How it works').parentElement).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    expect(box(document, 0)).toHaveTextContent('5');
    expect(box(document, 0).style.transform).toBe(
      'translateX(calc(0 * (100% + 8px))) translateY(0)',
    );
    expect(box(document, 0)).toHaveAttribute('data-state', 'idle');
    expect(screen.queryByText('0')).toBeNull();
  });

  it('shows the question with its answer first, then swaps on Next', () => {
    render(<VisualPlayer visual={visual} />);
    next();
    expect(screen.getByText('Pass 1')).toBeInTheDocument();
    expect(screen.getByText('Is 5 > 3?')).toBeInTheDocument();
    expect(screen.getByText('Yes, so they swap')).toBeInTheDocument();
    expect(box(document, 0)).toHaveAttribute('data-state', 'compared');
    expect(box(document, 0).style.transform).toBe(
      'translateX(calc(0 * (100% + 8px))) translateY(0)',
    );
    next();
    expect(screen.getByText('Is 5 > 3?')).toBeInTheDocument();
    expect(screen.getByText('Yes, so they swap')).toBeInTheDocument();
    expect(box(document, 0).style.transform).toBe(
      'translateX(calc(1 * (100% + 8px))) translateY(0)',
    );
    expect(box(document, 1).style.transform).toBe(
      'translateX(calc(0 * (100% + 8px))) translateY(0)',
    );
    next();
    expect(screen.getByText('8 is in place')).toBeInTheDocument();
    expect(box(document, 2)).toHaveAttribute('data-state', 'sorted');
    expect(box(document, 0)).toHaveAttribute('data-state', 'idle');
  });

  it('points at the two boxes compared, naming the position, and only then', () => {
    const { container } = render(
      <VisualPlayer visual={{ ...visual, pointers: ['j = {i}', 'j + 1'] }} />,
    );
    expect(container.querySelector('[data-pointer]')).toBeNull();
    next();
    const [left, right] = container.querySelectorAll<HTMLElement>('[data-pointer]');
    expect(left).toHaveTextContent('j = 0');
    expect(left.style.transform).toBe('translateX(calc(0 * (100% + 8px))) translateY(0)');
    expect(right).toHaveTextContent('j + 1');
    expect(right.style.transform).toBe('translateX(calc(1 * (100% + 8px))) translateY(0)');
    expect(left).toHaveClass('transition-transform', 'motion-reduce:transition-none');
    next();
    next();
    expect(container.querySelector('[data-pointer]')).toBeNull();
  });

  it('draws no pointer row for a visual without pointers', () => {
    const { container } = render(<VisualPlayer visual={visual} />);
    next();
    expect(container.querySelector('[data-pointer]')).toBeNull();
  });

  it('stops at both ends, with the buttons marked disabled but still focusable', () => {
    render(<VisualPlayer visual={visual} />);
    const previous = screen.getByRole('button', { name: /previous/i });
    expect(previous).toHaveAttribute('aria-disabled', 'true');
    expect(previous).not.toBeDisabled();
    fireEvent.click(previous);
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    for (let i = 0; i < 5; i++) next();
    expect(screen.getByText('Step 4 of 4')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toHaveAttribute('aria-disabled', 'true');
  });

  it('goes back with Previous and to the start with Start over', () => {
    render(<VisualPlayer visual={visual} />);
    next();
    next();
    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start over' }));
    expect(screen.getByText('How it works')).toBeInTheDocument();
  });

  it('steps with the arrow keys while focused and leaves other keys alone', () => {
    render(<VisualPlayer visual={visual} />);
    expect(player()).toHaveAttribute('tabindex', '0');
    expect(fireEvent.keyDown(player(), { key: 'ArrowRight' })).toBe(false);
    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
    fireEvent.keyDown(player(), { key: 'ArrowLeft' });
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
    expect(fireEvent.keyDown(player(), { key: 'Enter' })).toBe(true);
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
  });

  describe('the swap', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
      // @ts-expect-error jsdom has no Web Animations; the test put one in
      delete HTMLElement.prototype.animate;
    });

    const animate = () => {
      const fn = vi.fn();
      HTMLElement.prototype.animate = fn;
      return fn;
    };

    it('lifts the bigger box over the smaller one, which slides along the row, at the speed picked', () => {
      const fn = animate();
      render(<VisualPlayer visual={visual} />);
      next();
      expect(fn).not.toHaveBeenCalled();
      next();
      expect(fn).toHaveBeenCalledTimes(2);
      // Box 1 (the 3) moves left along the row; box 0 (the 5) moves right, over it
      expect(fn.mock.contexts).toEqual([box(document, 1), box(document, 0)]);
      const [under, over] = fn.mock.calls;
      expect(under[0].map((f: Keyframe) => f.transform)).toEqual([
        'translateX(calc(1 * (100% + 8px))) translateY(0)',
        'translateX(calc(1 * (100% + 8px))) translateY(0)',
        'translateX(calc(0 * (100% + 8px))) translateY(0)',
        'translateX(calc(0 * (100% + 8px))) translateY(0)',
      ]);
      expect(over[0].map((f: Keyframe) => f.transform)).toEqual([
        'translateX(calc(0 * (100% + 8px))) translateY(0)',
        'translateX(calc(0 * (100% + 8px))) translateY(-110%)',
        'translateX(calc(1 * (100% + 8px))) translateY(-110%)',
        'translateX(calc(1 * (100% + 8px))) translateY(0)',
      ]);
      expect(under[1]).toEqual({ duration: 1200, easing: 'ease-in-out' });

      fireEvent.click(screen.getByRole('button', { name: 'Slow' }));
      fireEvent.click(screen.getByRole('button', { name: /previous/i }));
      expect(fn.mock.calls[2][1].duration).toBe(2000);
      fireEvent.click(screen.getByRole('button', { name: 'Fast' }));
      next();
      expect(fn.mock.calls[4][1].duration).toBe(600);
    });

    it('puts several moved boxes in place at once', () => {
      const fn = animate();
      render(
        <VisualPlayer
          visual={{
            type: 'array',
            values: [3, 2, 1],
            caption: 'Start',
            steps: [
              { compare: [0, 1], swap: true, caption: 'Swap' },
              { compare: [1, 2], swap: true, caption: 'Swap again' },
            ],
          }}
        />,
      );
      next();
      next();
      expect(fn).toHaveBeenCalledTimes(4);
      fireEvent.click(screen.getByRole('button', { name: 'Start over' }));
      expect(fn).toHaveBeenCalledTimes(4);
    });

    it('jumps under reduced motion', () => {
      const fn = animate();
      vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));
      render(<VisualPlayer visual={visual} />);
      next();
      next();
      expect(fn).not.toHaveBeenCalled();
    });
  });

  it('enlarges into a dialog on the same step, which steps on its own and closes back', () => {
    render(<VisualPlayer visual={visual} />);
    next();
    const enlarge = screen.getByRole('button', { name: 'Enlarge' });
    fireEvent.click(enlarge);
    const dialog = screen.getByRole('dialog', { name: 'Step by step' });
    expect(dialog).toHaveFocus();
    expect(within(dialog).getByText('Is 5 > 3?').parentElement).toHaveAttribute(
      'aria-live',
      'polite',
    );
    // Only the dialog speaks while it is open
    expect(within(player()).getByText('Is 5 > 3?').parentElement).not.toHaveAttribute('aria-live');

    fireEvent.keyDown(dialog, { key: 'ArrowRight' });
    expect(within(dialog).getByText('Step 3 of 4')).toBeInTheDocument();
    next(dialog);
    expect(within(dialog).getByText('Step 4 of 4')).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: 'Enter' });

    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(enlarge).toHaveFocus();
    expect(screen.getByText('Step 4 of 4')).toBeInTheDocument();
  });

  it('closes the dialog with its button or a click beside it, not one inside it', () => {
    render(<VisualPlayer visual={visual} />);
    fireEvent.click(screen.getByRole('button', { name: 'Enlarge' }));
    fireEvent.mouseDown(screen.getByRole('dialog'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Enlarge' }));
    fireEvent.mouseDown(screen.getByRole('dialog').parentElement!);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
