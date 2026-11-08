import { describe, it, expect } from 'vitest';
import { timeAxis } from './timeAxis';

// n days in a row from start, as the API sends them.
function daysFrom(start: string, n: number, step = 1) {
  const first = new Date(`${start}T12:00:00Z`).getTime();
  return Array.from({ length: n }, (_, i) =>
    new Date(first + i * step * 86_400_000).toISOString().slice(0, 10),
  );
}

const labels = (rows: { label: string }[]) => rows.map((r) => r.label);

describe('timeAxis', () => {
  it('names every day of a month on a wide chart, and the months where they start', () => {
    const days = daysFrom('2026-10-10', 30); // Oct 10 to Nov 8
    const { ticks, context } = timeAxis(days, false, 600, 'en');
    expect(ticks).toHaveLength(30);
    expect(ticks[0]).toEqual({ i: 0, label: '10' });
    expect(ticks[29]).toEqual({ i: 29, label: '8' });
    expect(context).toEqual([
      { i: 0, label: 'Oct' },
      { i: 22, label: 'Nov' },
    ]);
  });

  it('thins the days on a phone, counting back from today', () => {
    const days = daysFrom('2026-10-10', 30);
    const { ticks } = timeAxis(days, false, 300, 'en');
    expect(ticks.map((t) => t.i)).toEqual([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29]);
  });

  it("leaves out the first month's name when the next starts right after it", () => {
    const days = daysFrom('2026-10-31', 30); // Oct 31 to Nov 29
    expect(timeAxis(days, false, 600, 'en').context).toEqual([{ i: 1, label: 'Nov' }]);
  });

  it('names the Mondays of a quarter, every one or every second', () => {
    const days = daysFrom('2026-08-11', 90); // a Tuesday to Nov 8
    const wide = timeAxis(days, false, 600, 'en');
    expect(wide.ticks.every((t) => new Date(`${days[t.i]}T12:00:00Z`).getUTCDay() === 1)).toBe(
      true,
    );
    expect(labels(wide.ticks).slice(0, 3)).toEqual(['17', '24', '31']);
    expect(labels(wide.ticks).at(-1)).toBe('2'); // Nov 2, the last Monday
    expect(labels(wide.context)).toEqual(['Aug', 'Sep', 'Oct', 'Nov']);

    const narrow = timeAxis(days, false, 200, 'en');
    expect(narrow.ticks).toHaveLength(Math.ceil(wide.ticks.length / 2));
    expect(narrow.ticks.at(-1)).toEqual(wide.ticks.at(-1));
  });

  it('names the months of a year by week, and the year where it turns', () => {
    const weeks = daysFrom('2025-11-10', 52, 7);
    const { ticks, context } = timeAxis(weeks, true, 600, 'en');
    expect(labels(ticks)).toEqual([
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
    ]);
    expect(labels(context)).toEqual(['2025', '2026']);
    expect(context[1].i).toBe(ticks[1].i); // the year under January
  });

  it('keeps every second or third month over two years, as the room allows', () => {
    const weeks = daysFrom('2024-11-11', 104, 7);
    expect(labels(timeAxis(weeks, true, 600, 'en').ticks)).toEqual([
      'Jan',
      'Mar',
      'May',
      'Jul',
      'Sep',
      'Nov',
      'Jan',
      'Mar',
      'May',
      'Jul',
      'Sep',
      'Nov',
    ]);
    expect(labels(timeAxis(weeks, true, 400, 'en').ticks)).toEqual([
      'Jan',
      'Apr',
      'Jul',
      'Oct',
      'Jan',
      'Apr',
      'Jul',
      'Oct',
    ]);
  });

  it('writes the months in the page language', () => {
    const days = daysFrom('2026-10-10', 30);
    expect(labels(timeAxis(days, false, 600, 'ro').context)).toEqual(['oct.', 'nov.']);
  });

  it('copes with one point or none', () => {
    expect(timeAxis([], false, 600, 'en')).toEqual({ ticks: [], context: [] });
    expect(timeAxis(['2026-11-08'], false, 600, 'en')).toEqual({
      ticks: [{ i: 0, label: '8' }],
      context: [{ i: 0, label: 'Nov' }],
    });
  });
});
