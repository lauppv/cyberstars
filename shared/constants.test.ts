import { describe, it, expect } from 'vitest';
import {
  progressPct,
  baseLanguage,
  MAIN_COURSE_KEYS,
  ALGO_COURSE_KEYS,
  ALL_COURSE_KEYS,
  xpForLesson,
  xpForCourse,
  levelFromXp,
  xpForLevel,
  levelTitleKey,
  MAX_TITLED_LEVEL,
} from './constants';

describe('progressPct', () => {
  it('returns 0 when there are no lessons', () => {
    expect(progressPct(0, 0)).toBe(0);
  });

  it('rounds to the nearest whole percent', () => {
    expect(progressPct(1, 3)).toBe(33);
    expect(progressPct(2, 3)).toBe(67);
    expect(progressPct(1, 2)).toBe(50);
  });

  it('is 100 when everything is complete', () => {
    expect(progressPct(7, 7)).toBe(100);
  });
});

describe('baseLanguage', () => {
  it('strips the algo- prefix', () => {
    expect(baseLanguage('algo-python')).toBe('python');
    expect(baseLanguage('algo-c')).toBe('c');
  });

  it('leaves plain language keys untouched', () => {
    expect(baseLanguage('java')).toBe('java');
  });
});

describe('xpForLesson', () => {
  it('awards 10 for the first lesson (sortOrder 1) and grows with position', () => {
    expect(xpForLesson(1)).toBe(10);
    expect(xpForLesson(6)).toBe(15);
  });
});

describe('xpForCourse', () => {
  it('sums the per-lesson awards for an n-lesson course', () => {
    expect(xpForCourse(0)).toBe(0);
    expect(xpForCourse(1)).toBe(10);
    // 10 + 11 + 12 = 33
    expect(xpForCourse(3)).toBe(33);
  });

  it('matches the explicit sum of xpForLesson over 1-based sortOrders', () => {
    let sum = 0;
    for (let s = 1; s <= 12; s++) sum += xpForLesson(s);
    expect(xpForCourse(12)).toBe(sum);
  });
});

describe('levelFromXp / xpForLevel', () => {
  it('starts everyone at level 1', () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(99)).toBe(1);
  });

  it('crosses to level 2 at 100 XP (c=100 quadratic curve)', () => {
    expect(levelFromXp(100)).toBe(2);
    expect(levelFromXp(399)).toBe(2);
    expect(levelFromXp(400)).toBe(3);
  });

  it('clamps negative XP to level 1', () => {
    expect(levelFromXp(-50)).toBe(1);
  });

  it('xpForLevel is the inverse threshold of levelFromXp', () => {
    for (let lvl = 1; lvl <= 12; lvl++) {
      const threshold = xpForLevel(lvl);
      expect(levelFromXp(threshold)).toBe(lvl);
      if (threshold > 0) expect(levelFromXp(threshold - 1)).toBe(lvl - 1);
    }
  });
});

describe('levelTitleKey', () => {
  it('maps a level to its i18n title key', () => {
    expect(levelTitleKey(1)).toBe('level.title.1');
    expect(levelTitleKey(5)).toBe('level.title.5');
  });

  it('clamps below 1 and above the max titled level', () => {
    expect(levelTitleKey(0)).toBe('level.title.1');
    expect(levelTitleKey(99)).toBe(`level.title.${MAX_TITLED_LEVEL}`);
  });
});

describe('course key lists', () => {
  it('ALL_COURSE_KEYS is MAIN followed by ALGO', () => {
    expect(ALL_COURSE_KEYS).toEqual([...MAIN_COURSE_KEYS, ...ALGO_COURSE_KEYS]);
  });

  it('every algo key reduces to a known main language', () => {
    for (const key of ALGO_COURSE_KEYS) {
      expect(MAIN_COURSE_KEYS).toContain(baseLanguage(key));
    }
  });
});
