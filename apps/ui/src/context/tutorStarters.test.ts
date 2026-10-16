import { describe, it, expect, vi, afterEach } from 'vitest';
import type { CourseProgress } from '@cyberstars/shared/progress';
import { pickStarters, type StudentState } from './tutorStarters';

const NOW = Date.parse('2026-10-20T12:00:00Z');
const daysAgo = (n: number) => new Date(NOW - n * 24 * 60 * 60 * 1000).toISOString();

function course(courseKey: string, lessons: Partial<CourseProgress['lessons'][number]>[]) {
  return {
    courseKey,
    completed: 0,
    total: lessons.length,
    earnedXp: 0,
    totalXp: 0,
    lessons: lessons.map((l, i) => ({
      slug: `${courseKey}-${i + 1}`,
      title: `${courseKey} ${i + 1}`,
      completed: false,
      completedAt: null,
      lastAccessedAt: null,
      ...l,
    })),
  };
}

function student(overrides: Partial<StudentState>): StudentState {
  return { level: null, interests: null, progress: {}, now: NOW, ...overrides };
}

const keys = (pathname: string, s: StudentState) =>
  pickStarters(pathname, s).map((st) => (st.values ? `${st.key}:${st.values.lesson}` : st.key));

afterEach(() => vi.restoreAllMocks());

describe('pickStarters', () => {
  it('offers three at random, the page one first, when nothing is known about the student', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(keys('/courses', student({}))).toEqual([
      'tutor.start.course',
      'tutor.start.idea',
      'tutor.start.help',
    ]);
  });

  it('starts a new account on the first lesson of what it picked, with questions about it', () => {
    const progress = {
      python: course('python', [
        { completed: true, completedAt: daysAgo(0), lastAccessedAt: daysAgo(0) },
        {},
      ]),
      linux: course('linux', [{}, {}]),
    };
    const s = student({ interests: ['linux'], progress });
    expect(keys('/', s)).toEqual([
      'tutor.start.next:linux 1',
      'tutor.start.linux',
      'tutor.start.course',
    ]);
    // The same state always gets the same questions.
    expect(keys('/', s)).toEqual(keys('/', s));
  });

  it('puts the unfinished lesson first, then the next one, then a lesson to be quizzed on', () => {
    const progress = {
      python: course('python', [
        { completed: true, completedAt: daysAgo(9), lastAccessedAt: daysAgo(9) },
        { completed: true, completedAt: daysAgo(3), lastAccessedAt: daysAgo(3) },
        { lastAccessedAt: daysAgo(1) },
        {},
      ]),
    };
    expect(keys('/', student({ interests: ['python'], progress }))).toEqual([
      'tutor.start.finish:python 3',
      'tutor.start.next:python 4',
      'tutor.start.quiz:python 1',
    ]);
  });

  it('keeps the page question first and fills with questions for the level and the picks', () => {
    const progress = { c: course('c', [{}, {}]) };
    expect(keys('/algorithms', student({ level: 'advanced', interests: ['c'], progress }))).toEqual(
      ['tutor.start.challenge', 'tutor.start.next:c 1', 'tutor.start.pointers'],
    );
  });

  it('goes by the courses an account from before the question has been in', () => {
    const progress = {
      java: course('java', [
        { completed: true, completedAt: daysAgo(1), lastAccessedAt: daysAgo(1) },
        {},
      ]),
      c: course('c', [{}, {}]),
    };
    expect(keys('/', student({ progress }))).toEqual([
      'tutor.start.next:java 2',
      'tutor.start.course',
      'tutor.start.idea',
    ]);
  });
});
