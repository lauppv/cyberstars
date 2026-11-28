import { describe, it, expect } from 'vitest';
import { PREVIEW_FEATURES } from './features.js';
import {
  progressPct,
  baseLanguage,
  MAIN_COURSE_KEYS,
  ALGO_COURSE_KEYS,
  CHALLENGE_XP,
  difficultyOf,
  ALL_COURSE_KEYS,
  TERMINAL_COURSE_KEYS,
  WEB_COURSE_KEYS,
  LISTED_COURSE_KEYS,
  isClosedCourse,
  xpForLesson,
  xpForCourse,
  dailyBonusXp,
  PART_STARTS,
  levelFromXp,
  xpForLevel,
  levelTitleKey,
  MAX_TITLED_LEVEL,
  CODE_LANGUAGES,
  MULTI_LANGUAGE_COURSE_KEYS,
  isMultiLanguage,
  isCodeLanguage,
  codeLanguageOf,
  isBeta,
} from './constants.js';

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

// n lessons with plain titles, sortOrder 1..n
const course = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ sortOrder: i + 1, title: `Lesson ${i + 1}` }));
const lesson = (sortOrder: number, title = 'Lesson') => ({ sortOrder, title });

describe('difficultyOf', () => {
  it("reads a challenge title's difficulty", () => {
    expect(difficultyOf('Easy · Two Sum')).toBe('easy');
    expect(difficultyOf('Medium · Spiral')).toBe('medium');
    expect(difficultyOf('Hard · Group Anagrams')).toBe('hard');
  });

  it('is null on a title without one', () => {
    expect(difficultyOf('Variables')).toBeNull();
    expect(difficultyOf('The Easy · way')).toBeNull();
  });
});

describe('xpForLesson', () => {
  it('gives 10 XP to the first lesson and 30 to the last, evenly in between', () => {
    expect(xpForLesson('python', lesson(1), 112)).toBe(10);
    expect(xpForLesson('python', lesson(112), 112)).toBe(30);
    expect(xpForLesson('python', lesson(3), 5)).toBe(20);
    expect(xpForLesson('python', lesson(2), 5)).toBe(15);
  });

  it('gives 10 XP to the only lesson of a one-lesson course', () => {
    expect(xpForLesson('python', lesson(1), 1)).toBe(10);
  });

  it('starts again at 10 on each part of a course split into parts', () => {
    const starts = PART_STARTS['web-dev'];
    const total = 375;
    expect(xpForLesson('web-dev', lesson(starts[0]), total)).toBe(10);
    expect(xpForLesson('web-dev', lesson(starts[1] - 1), total)).toBe(30);
    expect(xpForLesson('web-dev', lesson(starts[1]), total)).toBe(10);
    expect(xpForLesson('web-dev', lesson(starts.at(-1)!), total)).toBe(10);
    expect(xpForLesson('web-dev', lesson(total), total)).toBe(30);
  });

  it('pays a challenge by its difficulty, not its place', () => {
    for (const key of ALGO_COURSE_KEYS) {
      expect(xpForLesson(key, lesson(1, 'Hard · A'), 20), key).toBe(100);
      expect(xpForLesson(key, lesson(20, 'Easy · B'), 20), key).toBe(40);
      expect(xpForLesson(key, lesson(5, 'Medium · C'), 20), key).toBe(70);
    }
  });

  it('counts a challenge without a difficulty as Easy', () => {
    expect(xpForLesson('algo-python', lesson(3, 'Two Sum'), 20)).toBe(CHALLENGE_XP.easy);
  });
});

describe('xpForCourse', () => {
  it("sums its lessons' awards", () => {
    expect(xpForCourse('python', [])).toBe(0);
    expect(xpForCourse('python', course(1))).toBe(10);
    // 10 + 20 + 30
    expect(xpForCourse('python', course(3))).toBe(60);
    expect(
      xpForCourse('algo-c', [
        lesson(1, 'Easy · A'),
        lesson(2, 'Medium · B'),
        lesson(3, 'Hard · C'),
      ]),
    ).toBe(210);
  });
});

describe('dailyBonusXp', () => {
  it("is a fifth of the lesson's award", () => {
    expect(dailyBonusXp('python', lesson(112), 112)).toBe(6);
    expect(dailyBonusXp('web-dev', lesson(PART_STARTS['web-dev'][1]), 375)).toBe(2);
    expect(dailyBonusXp('algo-java', lesson(1, 'Hard · A'), 20)).toBe(20);
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

describe('web courses', () => {
  it('are courses of their own, apart from the others', () => {
    for (const key of WEB_COURSE_KEYS) {
      expect([...ALL_COURSE_KEYS, ...TERMINAL_COURSE_KEYS]).not.toContain(key);
    }
  });

  it('are closed and listed nowhere while Web Development is in preview', () => {
    for (const key of WEB_COURSE_KEYS) {
      expect(isClosedCourse(key)).toBe(PREVIEW_FEATURES.webDevelopment);
      expect(LISTED_COURSE_KEYS.includes(key)).toBe(!PREVIEW_FEATURES.webDevelopment);
    }
  });

  it('leave every other course open and listed as before', () => {
    for (const key of [...ALL_COURSE_KEYS, ...TERMINAL_COURSE_KEYS]) {
      expect(isClosedCourse(key)).toBe(false);
    }
    expect(
      LISTED_COURSE_KEYS.slice(0, MAIN_COURSE_KEYS.length + TERMINAL_COURSE_KEYS.length),
    ).toEqual([...MAIN_COURSE_KEYS, ...TERMINAL_COURSE_KEYS]);
  });
});

describe('multi-language courses', () => {
  it('teach every lesson in Python, Java and C, as a course or a challenge set', () => {
    expect(CODE_LANGUAGES).toEqual(['python', 'java', 'c']);
    expect(MULTI_LANGUAGE_COURSE_KEYS).toEqual(['trees-graphs', 'algo-trees-graphs']);
    for (const key of MULTI_LANGUAGE_COURSE_KEYS) {
      expect(isMultiLanguage(key)).toBe(true);
      expect(ALL_COURSE_KEYS).toContain(key);
    }
    expect(MAIN_COURSE_KEYS).toContain('trees-graphs');
    expect(ALGO_COURSE_KEYS).toContain('algo-trees-graphs');
    expect(isMultiLanguage('python')).toBe(false);
    expect(isMultiLanguage('algo-c')).toBe(false);
  });

  it('knows a code language from anything else', () => {
    expect(isCodeLanguage('java')).toBe(true);
    expect(isCodeLanguage('algo-java')).toBe(false);
    expect(isCodeLanguage('linux')).toBe(false);
    expect(isCodeLanguage(null)).toBe(false);
  });

  it('names the language a lesson runs in: the one picked, else Python', () => {
    expect(codeLanguageOf('trees-graphs', 'c')).toBe('c');
    expect(codeLanguageOf('trees-graphs')).toBe('python');
    expect(codeLanguageOf('trees-graphs', 'ruby')).toBe('python');
    expect(codeLanguageOf('algo-trees-graphs', 'java')).toBe('java');
  });

  it("names a one-language course's own language, whatever was picked", () => {
    expect(codeLanguageOf('algo-java', 'c')).toBe('java');
    expect(codeLanguageOf('python')).toBe('python');
  });

  it('are no longer Beta, now that they are whole', () => {
    expect(isBeta('trees-graphs')).toBe(false);
    expect(isBeta('algo-trees-graphs')).toBe(false);
    expect(isBeta('python')).toBe(false);
  });
});
