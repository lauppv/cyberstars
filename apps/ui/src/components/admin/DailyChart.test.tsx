import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import type { ComponentProps } from 'react';
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

// The chart with the point picked kept here, as VisitorsSection keeps it.
function Chart(props: Omit<ComponentProps<typeof DailyChart>, 'active' | 'onActive'>) {
  const [active, setActive] = useState<number | null>(null);
  return <DailyChart {...props} active={active} onActive={setActive} />;
}

describe('DailyChart', () => {
  function svg() {
    return screen.getByRole('img', { name: 'Visitors a day' });
  }

  it('draws the axis in clean steps and names each day under the month', () => {
    render(<Chart days={days} field="visitors" title="Visitors a day" />);
    expect(screen.getByText('Visitors a day')).toBeInTheDocument();
    for (const tick of ['0', '4', '6', '8', '1', '3'])
      expect(screen.getByText(tick)).toBeInTheDocument();
    expect(screen.getAllByText('2')).toHaveLength(2); // a count on the left, a day below
    expect(screen.getByText('Nov')).toHaveAttribute('text-anchor', 'start');
  });

  it("ends a month's name at the right edge when it starts too near it", () => {
    const turn: VisitDay[] = ['2026-10-30', '2026-10-31', '2026-11-01'].map((day) => ({
      day,
      visitors: 1,
      views: 1,
      newAccounts: 0,
    }));
    render(<Chart days={turn} field="visitors" title="Visitors a day" />);
    expect(screen.getByText('Oct')).toHaveAttribute('text-anchor', 'start');
    expect(screen.getByText('Nov')).toHaveAttribute('text-anchor', 'end');
  });

  it('shows nothing for a point picked past its last day', () => {
    render(
      <DailyChart
        days={days}
        field="visitors"
        title="Visitors a day"
        active={5}
        onActive={() => {}}
      />,
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it("shows the chart's number for the day picked with the arrow keys, and hides it on blur", () => {
    render(<Chart days={days} field="visitors" title="Visitors a day" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    fireEvent.keyDown(svg(), { key: 'ArrowLeft' }); // from the last day back one
    const readout = screen.getByRole('status');
    expect(readout).toHaveTextContent('7 visitors');
    expect(readout).not.toHaveTextContent('new accounts');

    fireEvent.keyDown(svg(), { key: 'ArrowLeft' });
    fireEvent.keyDown(svg(), { key: 'ArrowLeft' }); // already on the first day
    expect(screen.getByRole('status')).toHaveTextContent('1 visitor');

    fireEvent.keyDown(svg(), { key: 'ArrowRight' });
    fireEvent.keyDown(svg(), { key: 'ArrowRight' });
    fireEvent.keyDown(svg(), { key: 'ArrowRight' }); // already on the last day
    expect(screen.getByRole('status')).toHaveTextContent('4 visitors');
    fireEvent.keyDown(svg(), { key: 'Enter' }); // not a key it uses

    fireEvent.blur(svg());
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('names a week by its first day and year', () => {
    render(<Chart days={days} field="visitors" title="Visitors a day" weekly />);
    expect(screen.getByText('2026')).toBeInTheDocument();
    fireEvent.keyDown(svg(), { key: 'ArrowLeft' });
    expect(screen.getByRole('status')).toHaveTextContent(/Week of (Nov 2, 2026|2 Nov 2026)/);
  });

  it('follows the pointer to the nearest day', () => {
    const { container } = render(<Chart days={days} field="newAccounts" title="New" />);
    const target = container.querySelector('rect')!;
    target.getBoundingClientRect = () => ({ left: 0, width: 100 }) as DOMRect;

    fireEvent.pointerMove(target, { clientX: 2 });
    expect(screen.getByRole('status')).toHaveTextContent('0 new accounts');
    fireEvent.pointerMove(target, { clientX: 98 });
    expect(screen.getByRole('status')).toHaveTextContent('1 new account');

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
    const { unmount } = render(<Chart days={days} field="visitors" title="Visitors a day" />);
    expect(svg()).toHaveAttribute('viewBox', '0 0 300 176');
    unmount();
    expect(disconnect).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
