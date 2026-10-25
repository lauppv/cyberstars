import { describe, it, expect } from 'vitest';
import type { VisitDay } from '@cyberstars/shared/visits';
import { byWeek } from './byWeek';

describe('byWeek', () => {
  it('adds each seven days up under the first of them', () => {
    const days: VisitDay[] = Array.from({ length: 14 }, (_, i) => ({
      day: `2026-11-${String(i + 1).padStart(2, '0')}`,
      visitors: i,
      views: 2 * i,
      newAccounts: i === 9 ? 1 : 0,
    }));
    expect(byWeek(days)).toEqual([
      { day: '2026-11-01', visitors: 21, views: 42, newAccounts: 0 },
      { day: '2026-11-08', visitors: 70, views: 140, newAccounts: 1 },
    ]);
  });
});
