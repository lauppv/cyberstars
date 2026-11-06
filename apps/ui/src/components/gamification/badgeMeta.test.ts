import { describe, it, expect } from 'vitest';
import type { TFunction } from 'i18next';
import { badgeLabel } from './badgeMeta';

const t = ((key: string, opts?: Record<string, unknown>) =>
  opts ? `${key} ${JSON.stringify(opts)}` : key) as unknown as TFunction;

describe('badgeLabel', () => {
  it('names levels 1 to 6 by their frame', () => {
    const tiers = [1, 2, 3, 4, 5, 6].map((lvl) => badgeLabel(t, 'C', lvl));
    expect(tiers).toEqual(
      ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'legend'].map(
        (k) => `gamification.tier ${JSON.stringify({ course: 'C', tier: `gamification.${k}` })}`,
      ),
    );
  });

  it('falls back to the level number past Legend', () => {
    expect(badgeLabel(t, 'C', 7)).toBe(
      `gamification.tier ${JSON.stringify({ course: 'C', tier: `level.short ${JSON.stringify({ n: 7 })}` })}`,
    );
  });
});
