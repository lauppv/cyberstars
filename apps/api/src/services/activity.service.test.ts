import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { computeStreak, listDone, recentActivity } from './activity.service.js';

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

  it('counts a single completion made today', () => {
    expect(computeStreak([{ at: at(0) }])).toBe(1);
  });

  it('counts consecutive days ending today', () => {
    expect(computeStreak([{ at: at(0) }, { at: at(1) }, { at: at(2) }])).toBe(3);
  });

  it('still counts when the most recent day is yesterday', () => {
    expect(computeStreak([{ at: at(1) }, { at: at(2) }])).toBe(2);
  });

  it('returns 0 when the most recent activity is older than yesterday', () => {
    expect(computeStreak([{ at: at(2) }, { at: at(3) }])).toBe(0);
  });

  it('stops at the first gap', () => {
    // today, yesterday, then a missing day (2) before day 3, so the streak breaks at 2.
    expect(computeStreak([{ at: at(0) }, { at: at(1) }, { at: at(3) }])).toBe(2);
  });

  it('dedupes multiple completions on the same day', () => {
    expect(computeStreak([{ at: at(0, 8) }, { at: at(0, 20) }, { at: at(1) }])).toBe(2);
  });

  it('does not depend on input ordering', () => {
    expect(computeStreak([{ at: at(2) }, { at: at(0) }, { at: at(1) }])).toBe(3);
  });
});

describe('listDone', () => {
  it('tells lessons, algorithms and Laniakea passes apart, skipping lessons not completed', () => {
    expect(
      listDone(
        [
          { courseKey: 'python', completedAt: at(0) },
          { courseKey: 'algo-c', completedAt: at(1) },
          { courseKey: 'java', completedAt: null },
        ],
        [at(2)],
      ),
    ).toEqual([
      { at: at(2), kind: 'recap' },
      { at: at(0), kind: 'lesson' },
      { at: at(1), kind: 'algo' },
    ]);
  });
});

describe('recentActivity', () => {
  it("keeps only the heatmap's window, as ISO timestamps", () => {
    expect(
      recentActivity(
        [
          { at: at(0), kind: 'lesson' },
          { at: at(200), kind: 'algo' },
          { at: at(3), kind: 'recap' },
        ],
        NOW,
      ),
    ).toEqual([
      { at: at(0).toISOString(), kind: 'lesson' },
      { at: at(3).toISOString(), kind: 'recap' },
    ]);
  });
});
