import { describe, it, expect } from 'vitest';
import { WEB_COURSE_KEYS } from '@cyberstars/shared/constants';
import { courseParts, lessons } from './curriculum.js';
import { lessonTitlesRo, partTitlesRo } from './curriculum-ro.js';

// A web course is English only until it is translated (CYB-117): its lessons
// and parts show their English names on the Romanian site
const english = (course: string) => WEB_COURSE_KEYS.includes(course);

describe('lessonTitlesRo', () => {
  it('titles every lesson, so a new one needs its Romanian title here', () => {
    const untitled = lessons.filter(
      (l) => !english(l.courseKey) && !lessonTitlesRo[l.courseKey]?.[l.slug],
    );
    expect(untitled.map((l) => `${l.courseKey}/${l.slug}`)).toEqual([]);
  });

  it('titles only lessons the curriculum has', () => {
    const known = new Set(lessons.map((l) => `${l.courseKey}/${l.slug}`));
    const unknown = Object.entries(lessonTitlesRo).flatMap(([course, titles]) =>
      Object.keys(titles)
        .map((slug) => `${course}/${slug}`)
        .filter((key) => !known.has(key)),
    );
    expect(unknown).toEqual([]);
  });

  it('keeps a challenge English difficulty in front, which the list reads', () => {
    const titled = lessons.filter((l) => lessonTitlesRo[l.courseKey]?.[l.slug]);
    const lost = titled.filter((l) => {
      const difficulty = /^(Easy|Medium|Hard) · /.exec(l.title)?.[1];
      return difficulty && !lessonTitlesRo[l.courseKey][l.slug].startsWith(`${difficulty} · `);
    });
    expect(lost.map((l) => `${l.courseKey}/${l.slug}`)).toEqual([]);
  });
});

describe('partTitlesRo', () => {
  const parts = Object.entries(courseParts).flatMap(([course, list]) =>
    list.map((part) => `${course}/${part.key}`),
  );

  it('names every part of a course, so a new one needs its Romanian name here', () => {
    const unnamed = parts.filter((key) => {
      const [course, part] = key.split('/');
      return !english(course) && !partTitlesRo[course]?.[part];
    });
    expect(unnamed).toEqual([]);
  });

  it('names only parts the curriculum has', () => {
    const known = new Set(parts);
    const unknown = Object.entries(partTitlesRo).flatMap(([course, titles]) =>
      Object.keys(titles)
        .map((part) => `${course}/${part}`)
        .filter((key) => !known.has(key)),
    );
    expect(unknown).toEqual([]);
  });
});
