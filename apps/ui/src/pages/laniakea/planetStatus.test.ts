import { describe, it, expect } from 'vitest';
import type { LaniakeaPlanet } from '@cyberstars/shared/laniakea';
import { boardPlanets, canFly, countdownTo, isOwned, splitWait, statusOf } from './planetStatus';

const NOW = Date.parse('2026-10-24T12:00:00Z');
const at = (msFromNow: number) => new Date(NOW + msFromNow).toISOString();

function planet(over: Partial<LaniakeaPlanet> = {}): LaniakeaPlanet {
  return {
    slug: 'print',
    lessonDone: true,
    hasQuiz: true,
    level: 0,
    passedAt: null,
    nextRecapAt: null,
    retryAt: null,
    ...over,
  };
}

describe('statusOf', () => {
  it('reads what a planet means right now', () => {
    expect(statusOf(planet({ lessonDone: false }), NOW)).toBe('locked');
    expect(statusOf(planet({ hasQuiz: false }), NOW)).toBe('soon');
    expect(statusOf(planet(), NOW)).toBe('conquerable');
    expect(statusOf(planet({ retryAt: at(1000) }), NOW)).toBe('retry');
    expect(statusOf(planet({ retryAt: at(-1000) }), NOW)).toBe('conquerable');
    expect(statusOf(planet({ level: 2, nextRecapAt: at(-1) }), NOW)).toBe('recap');
    expect(statusOf(planet({ level: 2, nextRecapAt: at(1000) }), NOW)).toBe('owned');
    expect(statusOf(planet({ level: 8 }), NOW)).toBe('forever');
  });

  it('tells which planets are the student’s and which can be flown to now', () => {
    expect(isOwned(planet({ level: 1 }))).toBe(true);
    expect(isOwned(planet())).toBe(false);
    expect(['conquerable', 'recap', 'owned', 'forever'].every((s) => canFly(s as never))).toBe(
      true,
    );
    expect(['locked', 'soon', 'retry'].some((s) => canFly(s as never))).toBe(false);
  });
});

describe('countdownTo', () => {
  it('runs to the next try or the next recap', () => {
    expect(countdownTo(planet({ retryAt: at(5000) }), 'retry')).toBe(NOW + 5000);
    expect(countdownTo(planet({ level: 1, nextRecapAt: at(9000) }), 'owned')).toBe(NOW + 9000);
    expect(countdownTo(planet(), 'conquerable')).toBeNull();
    expect(countdownTo(planet({ level: 1 }), 'owned')).toBeNull();
  });
});

describe('splitWait', () => {
  it('keeps the two largest units', () => {
    expect(splitWait(2 * 86400_000 + 5 * 3600_000 + 59_000)).toEqual({ unit: 'dh', a: 2, b: 5 });
    expect(splitWait(3 * 3600_000 + 12 * 60_000)).toEqual({ unit: 'hm', a: 3, b: 12 });
    expect(splitWait(4 * 60_000 + 1)).toEqual({ unit: 'ms', a: 4, b: 1 });
    expect(splitWait(-5)).toEqual({ unit: 'ms', a: 0, b: 0 });
  });
});

describe('boardPlanets', () => {
  const planets = [
    planet({ slug: 'a', level: 3, nextRecapAt: at(9000) }),
    planet({ slug: 'b', lessonDone: false }),
    planet({ slug: 'c', level: 1, nextRecapAt: at(-1) }),
    planet({ slug: 'd' }),
    planet({ slug: 'e', level: 2, nextRecapAt: at(3000) }),
    planet({ slug: 'f', level: 8 }),
    planet({ slug: 'g', retryAt: at(100) }),
    planet({ slug: 'h', hasQuiz: false }),
  ];
  const slugs = (sort: 'next' | 'order' | 'level') =>
    boardPlanets(planets, sort, NOW).map((p) => p.slug);

  it('lists what can be done now first, then the soonest countdowns', () => {
    expect(slugs('next')).toEqual(['c', 'd', 'g', 'e', 'a', 'f', 'h']);
  });

  it('can list the planets in lesson order or by how far they moved', () => {
    expect(slugs('order')).toEqual(['a', 'c', 'd', 'e', 'f', 'g', 'h']);
    expect(slugs('level')).toEqual(['f', 'a', 'e', 'c', 'd', 'g', 'h']);
  });
});
