import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import { WEB_COURSE_KEYS } from '@cyberstars/shared/constants';
import { parseWebFiles, startWebSite } from '@cyberstars/shared/webFiles';
import { carriedFrom, courseParts, courses, freshStartLessons, lessons } from './curriculum.js';
import { courseDir } from './paths.js';

describe('courseParts', () => {
  it('splits only courses the curriculum has', () => {
    const known = new Set(courses.map((c) => c.key));
    expect(Object.keys(courseParts).filter((key) => !known.has(key))).toEqual([]);
  });

  it("holds every lesson of a course once, in the course's order", () => {
    for (const [courseKey, parts] of Object.entries(courseParts)) {
      const inOrder = lessons
        .filter((l) => l.courseKey === courseKey)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((l) => l.slug);
      expect(
        parts.flatMap((p) => p.lessons),
        courseKey,
      ).toEqual(inOrder);
    }
  });

  it('gives each part a key of its own, a name and lessons', () => {
    for (const [courseKey, parts] of Object.entries(courseParts)) {
      const keys = parts.map((p) => p.key);
      expect(new Set(keys).size, courseKey).toBe(keys.length);
      const empty = parts.filter((p) => !p.title.trim() || p.lessons.length === 0);
      expect(
        empty.map((p) => `${courseKey}/${p.key}`),
        courseKey,
      ).toEqual([]);
    }
  });
});

describe('freshStartLessons', () => {
  it('names only lessons of a web course', () => {
    for (const [courseKey, slugs] of Object.entries(freshStartLessons)) {
      expect(WEB_COURSE_KEYS, courseKey).toContain(courseKey);
      const known = new Set(lessons.filter((l) => l.courseKey === courseKey).map((l) => l.slug));
      expect(
        slugs.filter((slug) => !known.has(slug)),
        courseKey,
      ).toEqual([]);
    }
  });
});

describe('carriedFrom', () => {
  const list = [
    { courseKey: 'web', slug: 'one', sortOrder: 1 },
    { courseKey: 'web', slug: 'project', sortOrder: 3 },
    { courseKey: 'web', slug: 'two', sortOrder: 2 },
    { courseKey: 'web', slug: 'three', sortOrder: 4 },
    { courseKey: 'other', slug: 'zero', sortOrder: 0 },
  ];
  const fresh = { web: ['project'] };

  it("is the lesson before, in the course's order", () => {
    expect(carriedFrom('web', 'two', list, fresh)).toBe('one');
  });

  it('skips a lesson that starts from its own files', () => {
    expect(carriedFrom('web', 'three', list, fresh)).toBe('two');
  });

  it("is null for the first lesson, one that starts from its own files and one the course hasn't", () => {
    expect(carriedFrom('web', 'one', list, fresh)).toBeNull();
    expect(carriedFrom('web', 'project', list, fresh)).toBeNull();
    expect(carriedFrom('web', 'zero', list, fresh)).toBeNull();
  });
});

// The course's version a web lesson starts from: the reference site of the
// lesson it carries on from with the files it adds
describe("a web lesson's start", () => {
  const webLessons = lessons.filter((l) => WEB_COURSE_KEYS.includes(l.courseKey));
  const read = (courseKey: string, name: string) => {
    const file = path.join(courseDir(courseKey), name);
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  };

  it('has the reference site of the lesson it carries on from', () => {
    const missing = webLessons
      .map((l) => ({ l, from: carriedFrom(l.courseKey, l.slug) }))
      .filter(({ l, from }) => from && read(l.courseKey, `${from}-solution.md`) === null)
      .map(({ l, from }) => `${l.courseKey}/${l.slug} ← ${from}`);
    expect(missing).toEqual([]);
  });

  it("fits a site's limits", () => {
    const over = webLessons
      .filter((l) => {
        const from = carriedFrom(l.courseKey, l.slug);
        const site = from ? parseWebFiles(read(l.courseKey, `${from}-solution.md`) ?? '') : [];
        const added = parseWebFiles(read(l.courseKey, `${l.slug}-code.md`) ?? '');
        return startWebSite(site, added) === null;
      })
      .map((l) => `${l.courseKey}/${l.slug}`);
    expect(over).toEqual([]);
  });
});
