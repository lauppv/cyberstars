import { describe, it, expect } from 'vitest';
import fs from 'fs';
import { lessons } from '@cyberstars/content/curriculum';
import { LANIAKEA_COURSE } from '@cyberstars/shared/laniakea';
import { contentDir } from './paths.js';
import { loadQuiz, pairProblems, quizFiles, quizSlugs } from './laniakea-quiz.js';
import { parseTemplates, planLesson } from './laniakea-templates.js';

// Every lesson's questions as they ship: a pool a test can be drawn from, in
// English and Romanian, the Romanian a true translation (same questions, same
// right answers) whose code stays ASCII like the Romanian lessons' code. The
// made questions must be the ones the templates make now; whether their answers
// are right takes running them, which `npm run check:quiz` does in CI.
const read = (file: string): unknown =>
  fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
const madeIds = (file: string) =>
  ((read(file) as { questions?: { id: string }[] }).questions ?? []).map((q) => q.id);
const planets = new Set(lessons.filter((l) => l.courseKey === LANIAKEA_COURSE).map((l) => l.slug));

describe('Laniakea questions', () => {
  const slugs = quizSlugs();

  it('has questions for at least one lesson', () => {
    expect(slugs.length).toBeGreaterThan(0);
  });

  it.each(slugs)('%s belongs to a lesson and reads in both languages', (slug) => {
    expect(planets.has(slug)).toBe(true);
    expect(fs.existsSync(quizFiles(slug, 'ro').quiz)).toBe(true);
    const en = loadQuiz(slug, 'en')!;
    const ro = loadQuiz(slug, 'ro')!;
    expect(pairProblems(en, ro)).toEqual([]);
    const notAscii = ro.questions.filter((q) => q.code !== null && /[^\x20-\x7e\n]/.test(q.code));
    expect(notAscii.map((q) => q.id)).toEqual([]);
  });

  it.each(slugs)('%s has the made questions its templates make', (slug) => {
    const en = quizFiles(slug, 'en');
    const ro = quizFiles(slug, 'ro');
    const plan = planLesson(parseTemplates(read(en.quiz)), parseTemplates(read(ro.quiz)));
    expect(madeIds(en.made)).toEqual(plan.en.map((p) => p.id));
    expect(madeIds(ro.made)).toEqual(plan.ro.map((p) => p.id));
  });

  it('has no made questions left over from a lesson without a quiz file', () => {
    const made = (dir: string) =>
      fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('-quiz-made.json'))
        .map((f) => f.slice(0, -'-quiz-made.json'.length));
    const dir = contentDir(LANIAKEA_COURSE);
    const stray = [...made(dir), ...made(`${dir}/ro`)].filter((slug) => !slugs.includes(slug));
    expect(stray).toEqual([]);
  });
});
