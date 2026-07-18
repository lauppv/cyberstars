import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { computeStreak } from './activity.service.js';

// Fixed "now" so the today/yesterday boundary logic is deterministic.
const NOW = new Date('2026-07-18T10:00:00Z');

// A completion `dayOffset` UTC days before today, at an arbitrary hour.
function at(dayOffset: number, hour = 12): Date {
  const d = new Date(Date.UTC(2026, 6, 18, hour));
  d.setUTCDate(d.getUTCDate() - dayOffset);
  return d;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});
afterEach(() => vi.useRealTimers());

describe('computeStreak', () => {
  it('returns 0 for no rows', () => {
    expect(computeStreak([])).toBe(0);
  });

  it('ignores rows without a completedAt', () => {
    expect(computeStreak([{ completedAt: null }, { completedAt: null }])).toBe(0);
  });

  it('counts a single completion made today', () => {
    expect(computeStreak([{ completedAt: at(0) }])).toBe(1);
  });

  it('counts consecutive days ending today', () => {
    expect(
      computeStreak([{ completedAt: at(0) }, { completedAt: at(1) }, { completedAt: at(2) }]),
    ).toBe(3);
  });

  it('still counts when the most recent day is yesterday', () => {
    expect(computeStreak([{ completedAt: at(1) }, { completedAt: at(2) }])).toBe(2);
  });

  it('returns 0 when the most recent activity is older than yesterday', () => {
    expect(computeStreak([{ completedAt: at(2) }, { completedAt: at(3) }])).toBe(0);
  });

  it('stops at the first gap', () => {
    // today, yesterday, then a missing day (2) before day 3 — streak breaks at 2.
    expect(
      computeStreak([{ completedAt: at(0) }, { completedAt: at(1) }, { completedAt: at(3) }]),
    ).toBe(2);
  });

  it('dedupes multiple completions on the same day', () => {
    expect(
      computeStreak([
        { completedAt: at(0, 8) },
        { completedAt: at(0, 20) },
        { completedAt: at(1) },
      ]),
    ).toBe(2);
  });

  it('does not depend on input ordering', () => {
    expect(
      computeStreak([{ completedAt: at(2) }, { completedAt: at(0) }, { completedAt: at(1) }]),
    ).toBe(3);
  });
});
