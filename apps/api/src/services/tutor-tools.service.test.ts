import { describe, it, expect } from 'vitest';
import { courses } from '@cyberstars/content/curriculum';
import {
  lessonStatement,
  listCourses,
  listPages,
  readLesson,
  searchLessons,
} from './tutor-tools.service.js';

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
});

describe('readLesson', () => {
  it('reads a lesson statement in the asked language', () => {
    const ro = readLesson('algo-python', 'caesar-cipher', 'ro');
    expect(ro).toMatchObject({ kind: 'challenge', link: '/lesson/algo-python/caesar-cipher' });
    expect(ro!.statement).toContain('Caesar');
    expect(ro!.statement).not.toEqual(readLesson('algo-python', 'caesar-cipher', 'en')!.statement);
  });

  it('names the lesson as the page does in that language', () => {
    expect(readLesson('algo-python', 'caesar-cipher', 'ro')!.title).toBe(
      'Medium · Cifrul lui Cezar',
    );
    expect(readLesson('algo-python', 'caesar-cipher', 'en')!.title).toBe('Medium · Caesar Cipher');
    expect(searchLessons('cezar', 'ro')[0].title).toBe('Medium · Cifrul lui Cezar');
  });

  it('refuses a slug the curriculum does not list before reading any file', () => {
    expect(readLesson('python', '../../../package', 'en')).toBeNull();
    expect(readLesson('python', 'for-solution', 'en')).toBeNull();
  });

  it('refuses a course that does not exist', () => {
    expect(readLesson('nope', 'for', 'en')).toBeNull();
  });
});

describe('lessonStatement', () => {
  it("reads the lesson's title and its statement in the asked language", () => {
    const ro = lessonStatement('algo-python', 'caesar-cipher', 'ro');
    expect(ro!.title).toEqual(expect.any(String));
    expect(ro!.statement).toEqual(readLesson('algo-python', 'caesar-cipher', 'ro')!.statement);
  });

  it('reads a multi-language lesson in the language asked, Python without one', () => {
    const java = lessonStatement('trees-graphs', 'trees', 'en', 'java')!.statement;
    const python = lessonStatement('trees-graphs', 'trees', 'en')!.statement;
    expect(java).toContain('public class Main');
    expect(python).toContain('def __init__');
    expect(python).not.toContain('public class Main');
  });

  it('refuses a slug the curriculum does not list before reading any file', () => {
    expect(lessonStatement('python', '../../../package', 'en')).toBeNull();
    expect(lessonStatement('python', 'for-solution', 'en')).toBeNull();
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

  it('lists the courses along with the pages', () => {
    expect(listPages('USER', true).courses).toEqual(listCourses());
  });
});

describe('listCourses', () => {
  it('links each course to its own page, and algorithms to their list', () => {
    const list = listCourses();
    expect(list).toContainEqual(
      expect.objectContaining({ title: 'Python', link: '/courses/python' }),
    );
    expect(list).toContainEqual(
      expect.objectContaining({ title: 'C Algorithms', link: '/algorithms/c' }),
    );
  });

  it('says what each course teaches and how many lessons it has', () => {
    const java = listCourses().find((c) => c.title === 'Java')!;
    expect(java.about).toBe(courses.find((c) => c.key === 'java')!.description);
    expect(java.lessons).toBeGreaterThan(0);
  });
});
