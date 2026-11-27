import { describe, it, expect } from 'vitest';
import en from '../i18n/locales/en.json';
import ro from '../i18n/locales/ro.json';
import {
  PLACEMENT_COURSES,
  PLACEMENT_QUESTIONS,
  pickQuestions,
  type PlacementCourse,
} from './placement';

// Every set of courses a student can pick, at least one
const PICKS: PlacementCourse[][] = Array.from(
  { length: 2 ** PLACEMENT_COURSES.length - 1 },
  (_, n) => PLACEMENT_COURSES.filter((_, i) => (n + 1) & (1 << i)),
);

describe('placement questions', () => {
  it('has ten questions for each course', () => {
    for (const course of PLACEMENT_COURSES) {
      expect(PLACEMENT_QUESTIONS.filter((q) => q.course === course)).toHaveLength(10);
    }
  });

  it('words every question and every course in English and Romanian, four options each', () => {
    for (const locale of [en, ro]) {
      const { questions, courses } = locale.placement as {
        questions: Record<string, { q: string; options: string[] }>;
        courses: Record<string, string>;
      };
      for (const q of PLACEMENT_QUESTIONS) {
        expect(questions[q.id]?.q).toBeTruthy();
        expect(questions[q.id].options).toHaveLength(4);
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(4);
      }
      expect(Object.keys(questions).sort()).toEqual(PLACEMENT_QUESTIONS.map((q) => q.id).sort());
      for (const course of PLACEMENT_COURSES) expect(courses[course]).toBeTruthy();
    }
  });
});

describe('pickQuestions', () => {
  it('asks ten different questions, only from the picked courses, shared out evenly', () => {
    for (const picked of PICKS) {
      const questions = pickQuestions(picked);
      expect(questions).toHaveLength(10);
      expect(new Set(questions.map((q) => q.id)).size).toBe(10);
      const shares = picked.map((c) => questions.filter((q) => q.course === c).length);
      expect(shares.reduce((a, b) => a + b, 0)).toBe(10);
      expect(Math.max(...shares) - Math.min(...shares)).toBeLessThanOrEqual(1);
    }
  });

  it('asks every question of a course picked alone, easy to hard', () => {
    expect(pickQuestions(['java'])).toEqual(PLACEMENT_QUESTIONS.filter((q) => q.course === 'java'));
  });

  it('spreads a smaller share over easy, medium and hard', () => {
    const at = (course: PlacementCourse, picked: PlacementCourse[]) => {
      const pool = PLACEMENT_QUESTIONS.filter((q) => q.course === course);
      return pickQuestions(picked)
        .filter((q) => q.course === course)
        .map((q) => pool.indexOf(q));
    };
    // 0-2 are easy, 3-6 medium, 7-9 hard. C comes first, so it gets the fourth
    expect(at('c', ['linux', 'c', 'algorithms'])).toEqual([1, 3, 6, 8]);
    expect(at('linux', ['linux', 'c', 'algorithms'])).toEqual([1, 5, 8]);
    expect(at('web', PLACEMENT_COURSES.slice())).toEqual([5]);
  });
});
