import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { lessons } from '@cyberstars/content/curriculum';
import { LANIAKEA_COURSE } from '@cyberstars/shared/laniakea';
import { contentDir } from './paths.js';
import { pairProblems, parseQuiz, quizSlugs } from './laniakea-quiz.js';

// Every lesson's questions as they ship: a pool a test can be drawn from, in
// English and Romanian, the Romanian a true translation (same questions, same
// right answers) whose code stays ASCII like the Romanian lessons' code.
const dir = contentDir(LANIAKEA_COURSE);
const read = (file: string) => parseQuiz(JSON.parse(fs.readFileSync(file, 'utf8')));
const planets = new Set(lessons.filter((l) => l.courseKey === LANIAKEA_COURSE).map((l) => l.slug));

describe('Laniakea questions', () => {
  const slugs = quizSlugs();

  it('has questions for at least one lesson', () => {
    expect(slugs.length).toBeGreaterThan(0);
  });

  it.each(slugs)('%s belongs to a lesson and reads in both languages', (slug) => {
    expect(planets.has(slug)).toBe(true);
    const en = read(path.join(dir, `${slug}-quiz.json`));
    const roFile = path.join(dir, 'ro', `${slug}-quiz.json`);
    expect(fs.existsSync(roFile)).toBe(true);
    const ro = read(roFile);
    expect(pairProblems(en, ro)).toEqual([]);
    const notAscii = ro.questions.filter((q) => q.code !== null && /[^\x20-\x7e\n]/.test(q.code));
    expect(notAscii.map((q) => q.id)).toEqual([]);
  });
});
