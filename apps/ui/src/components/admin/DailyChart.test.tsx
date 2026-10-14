import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DailyChart } from './DailyChart';
import { axisTicks } from './axisTicks';
import type { VisitDay } from '@cyberstars/shared/visits';

const days: VisitDay[] = [
  { day: '2026-11-01', visitors: 1, views: 5, newAccounts: 0 },
  { day: '2026-11-02', visitors: 7, views: 9, newAccounts: 2 },
  { day: '2026-11-03', visitors: 4, views: 4, newAccounts: 1 },
];

describe('axisTicks', () => {
  it.each([
    [0, [0, 1]],
    [1, [0, 1]],
    [3, [0, 1, 2, 3]],
    [7, [0, 2, 4, 6, 8]],
    [48, [0, 20, 40, 60]],
    [140, [0, 50, 100, 150]],
  ])('cuts an axis for %i into clean steps', (max, ticks) => {
    expect(axisTicks(max)).toEqual(ticks);
  });
});

describe('DailyChart', () => {
  function svg() {
    return screen.getByRole('img', { name: 'Visitors a day' });
  }

  it('draws the axis in clean steps and names its first and last day', () => {
    render(<DailyChart days={days} field="visitors" title="Visitors a day" />);
    expect(screen.getByText('Visitors a day')).toBeInTheDocument();
    for (const tick of ['0', '2', '4', '6', '8'])
      expect(screen.getByText(tick)).toBeInTheDocument();
    expect(screen.getByText(/Nov 1\b|\b1 Nov/)).toBeInTheDocument();
    expect(screen.getByText(/Nov 3\b|\b3 Nov/)).toBeInTheDocument();
  });

  it('shows both numbers for the day picked with the arrow keys, and hides them on blur', () => {
    render(<DailyChart days={days} field="visitors" title="Visitors a day" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    fireEvent.keyDown(svg(), { key: 'ArrowLeft' }); // from the last day back one
    const readout = screen.getByRole('status');
    expect(readout).toHaveTextContent('7 visitors');
    expect(readout).toHaveTextContent('2 new accounts');

    fireEvent.keyDown(svg(), { key: 'ArrowLeft' });
    fireEvent.keyDown(svg(), { key: 'ArrowLeft' }); // already on the first day
    expect(screen.getByRole('status')).toHaveTextContent('1 visitor');
    expect(screen.getByRole('status')).toHaveTextContent('0 new accounts');

    fireEvent.keyDown(svg(), { key: 'ArrowRight' });
    fireEvent.keyDown(svg(), { key: 'ArrowRight' });
    fireEvent.keyDown(svg(), { key: 'ArrowRight' }); // already on the last day
    expect(screen.getByRole('status')).toHaveTextContent('4 visitors');
    fireEvent.keyDown(svg(), { key: 'Enter' }); // not a key it uses

    fireEvent.blur(svg());
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('follows the pointer to the nearest day', () => {
    const { container } = render(<DailyChart days={days} field="newAccounts" title="New" />);
    const target = container.querySelector('rect')!;
    target.getBoundingClientRect = () => ({ left: 0, width: 100 }) as DOMRect;

    fireEvent.pointerMove(target, { clientX: 2 });
    expect(screen.getByRole('status')).toHaveTextContent('1 visitor');
    fireEvent.pointerMove(target, { clientX: 98 });
    expect(screen.getByRole('status')).toHaveTextContent('4 visitors');

    fireEvent.pointerLeave(target);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('draws at the width it is given, and stops watching once gone', () => {
    const disconnect = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(private cb: (entries: { contentRect: { width: number } }[]) => void) {}
        observe() {
          this.cb([{ contentRect: { width: 0 } }]); // not laid out yet
          this.cb([{ contentRect: { width: 300 } }]);
        }
        disconnect = disconnect;
      },
    );
    const { unmount } = render(<DailyChart days={days} field="visitors" title="Visitors a day" />);
    expect(svg()).toHaveAttribute('viewBox', '0 0 300 150');
    unmount();
    expect(disconnect).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
