import { describe, it, expect } from 'vitest';
import { lessons } from './curriculum.js';
import { lessonTitlesRo } from './curriculum-ro.js';

describe('lessonTitlesRo', () => {
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
