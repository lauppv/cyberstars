import { describe, it, expect } from 'vitest';
import { listPages, readLesson, searchLessons } from './tutor-tools.service.js';

describe('searchLessons', () => {
  it('finds the Python for loop lesson by its name', () => {
    const hits = searchLessons('for loops python');
    expect(hits[0]).toEqual({
      title: expect.any(String),
      course: 'Python',
      kind: 'lesson',
      link: '/lesson/python/for',
    });
  });

  it('finds an algorithm challenge and says it is one', () => {
    expect(searchLessons('caesar cipher')).toContainEqual(
      expect.objectContaining({ kind: 'challenge', link: '/lesson/algo-python/caesar-cipher' }),
    );
  });

  it('matches Romanian words with or without diacritics', () => {
    const withMarks = searchLessons('buclă for').map((h) => h.link);
    expect(withMarks).toContain('/lesson/python/for');
    expect(searchLessons('bucla for').map((h) => h.link)).toEqual(withMarks);
  });

  it('returns at most six results', () => {
    expect(searchLessons('print').length).toBeLessThanOrEqual(6);
  });

  it('returns nothing for a query made only of little words', () => {
    expect(searchLessons('how is the')).toEqual([]);
    expect(searchLessons('?!')).toEqual([]);
  });

  it('never lists a lesson of a course that is coming soon', () => {
    expect(searchLessons('kotlin').every((h) => !h.link.startsWith('/lesson/kotlin/'))).toBe(true);
  });
});

describe('readLesson', () => {
  it('reads a lesson statement in the asked language', () => {
    const ro = readLesson('algo-python', 'caesar-cipher', 'ro');
    expect(ro).toMatchObject({ kind: 'challenge', link: '/lesson/algo-python/caesar-cipher' });
    expect(ro!.statement).toContain('Caesar');
    expect(ro!.statement).not.toEqual(readLesson('algo-python', 'caesar-cipher', 'en')!.statement);
  });

  it('refuses a slug the curriculum does not list before reading any file', () => {
    expect(readLesson('python', '../../../package', 'en')).toBeNull();
    expect(readLesson('python', 'for-solution', 'en')).toBeNull();
  });

  it('refuses a course that is coming soon or does not exist', () => {
    expect(readLesson('kotlin', 'hello-world', 'en')).toBeNull();
    expect(readLesson('nope', 'for', 'en')).toBeNull();
  });
});

describe('listPages', () => {
  const links = (map: ReturnType<typeof listPages>) => map.pages.map((p) => p.link);

  it('leaves preview pages and the Admin page out for a student on prod', () => {
    const map = listPages('USER', true);
    expect(links(map)).toContain('/settings');
    expect(links(map)).not.toContain('/leaderboard');
    expect(links(map)).not.toContain('/admin');
    expect(links(map)).not.toContain('/laniakea');
  });

  it('lists preview pages on dev, still without Admin for a student', () => {
    const map = listPages('USER', false);
    expect(links(map)).toContain('/leaderboard');
    expect(links(map)).not.toContain('/admin');
  });

  it('lists everything for an admin on prod', () => {
    const map = listPages('ADMIN', true);
    expect(links(map)).toContain('/leaderboard');
    expect(links(map)).toContain('/admin');
  });

  it('links each course to its own page, algorithms to their list, and skips Kotlin', () => {
    const { courses } = listPages('USER', true);
    expect(courses).toContainEqual({ title: 'Python', link: '/courses/python' });
    expect(courses).toContainEqual({ title: 'C Algorithms', link: '/algorithms/c' });
    expect(courses.map((c) => c.title)).not.toContain('Kotlin');
  });
});
