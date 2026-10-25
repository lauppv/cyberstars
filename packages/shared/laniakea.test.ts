import { describe, it, expect } from 'vitest';
import {
  DAY_MS,
  FOREVER_LEVEL,
  QUIZ_OUT,
  RECAP_DAYS,
  nextRecapAt,
  planetLessons,
} from './laniakea.js';

describe('the rules', () => {
  it('ends a test once it can no longer be passed', () => {
    expect(QUIZ_OUT).toBe(5);
  });

  it('keeps a planet for good after seven recaps, 127 days at the least', () => {
    expect(FOREVER_LEVEL).toBe(8);
    expect(RECAP_DAYS.reduce((a, b) => a + b, 0)).toBe(127);
  });
});

describe('nextRecapAt', () => {
  const passedAt = new Date('2026-10-24T10:00:00Z');

  it('waits a day after the conquest, then twice as long each step', () => {
    expect(nextRecapAt(1, passedAt)?.toISOString()).toBe('2026-10-25T10:00:00.000Z');
    expect(nextRecapAt(2, passedAt)?.toISOString()).toBe('2026-10-26T10:00:00.000Z');
    expect(nextRecapAt(7, passedAt)!.getTime() - passedAt.getTime()).toBe(64 * DAY_MS);
  });

  it('has none before the conquest or once the planet is kept for good', () => {
    expect(nextRecapAt(0, null)).toBeNull();
    expect(nextRecapAt(0, passedAt)).toBeNull();
    expect(nextRecapAt(FOREVER_LEVEL, passedAt)).toBeNull();
    expect(nextRecapAt(3, null)).toBeNull();
  });

  it('takes a shorter day for trying it out', () => {
    expect(nextRecapAt(3, passedAt, 1000)?.getTime()).toBe(passedAt.getTime() + 4000);
  });
});

describe('planetLessons', () => {
  const slugs = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  it('makes the first six lessons one planet under the first slug, then one each', () => {
    expect(planetLessons(slugs)).toEqual([
      { slug: 'a', lessons: ['a', 'b', 'c', 'd', 'e', 'f'] },
      { slug: 'g', lessons: ['g'] },
      { slug: 'h', lessons: ['h'] },
    ]);
  });

  it('keeps a shorter course as one planet, and none without lessons', () => {
    expect(planetLessons(['a', 'b'])).toEqual([{ slug: 'a', lessons: ['a', 'b'] }]);
    expect(planetLessons([])).toEqual([]);
  });
});
