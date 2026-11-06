import { describe, it, expect } from 'vitest';
import type { TFunction } from 'i18next';
import { badgeLabel, badgeMaxLevel, nextBadge } from './badgeMeta';

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

describe('nextBadge', () => {
  it('starts on First Steps', () => {
    expect(nextBadge(0, 60)).toEqual({ level: 0, earned: false });
  });

  it('points at the next tier of 10 lessons', () => {
    expect(nextBadge(1, 60)).toEqual({ level: 1, earned: false });
    expect(nextBadge(10, 60)).toEqual({ level: 2, earned: false });
    expect(nextBadge(59, 60)).toEqual({ level: 6, earned: false });
  });

  it('keeps the last badge once every one is earned', () => {
    expect(nextBadge(60, 60)).toEqual({ level: 6, earned: true });
    expect(nextBadge(12, 12)).toEqual({ level: 1, earned: true });
  });

  it('gives a course under 10 lessons one tier that needs 10', () => {
    expect(nextBadge(5, 8)).toEqual({ level: 1, earned: false });
    expect(badgeMaxLevel(8)).toBe(1);
  });
});
