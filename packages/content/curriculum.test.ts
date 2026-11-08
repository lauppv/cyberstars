import { describe, it, expect } from 'vitest';
import { courseParts, courses, lessons } from './curriculum.js';

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
