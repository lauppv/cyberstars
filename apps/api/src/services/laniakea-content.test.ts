import { describe, it, expect } from 'vitest';
import fs from 'fs';
import { lessons } from '@cyberstars/content/curriculum';
import {
  LANIAKEA_COURSE,
  QUIZ_LENGTH,
  QUIZ_SAME_TEXT,
  planetLessons,
} from '@cyberstars/shared/laniakea';
import { contentDir } from './paths.js';
import {
  loadQuiz,
  pairProblems,
  quizFiles,
  quizSlugs,
  type QuizQuestionSpec,
} from './laniakea-quiz.js';
import { madeId, parseTemplates, planLesson } from './laniakea-templates.js';

// Every lesson's questions as they ship: a pool a test can be drawn from, in
// English and Romanian, the Romanian a true translation (same questions, same
// right answers) whose code stays ASCII like the Romanian lessons' code. The
// made questions must be the ones the templates make now; whether their answers
// are right takes running them, which `npm run check:quiz` does in CI.
const read = (file: string): unknown =>
  fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
const madeIds = (file: string) =>
  ((read(file) as { questions?: { id: string }[] }).questions ?? []).map((q) => q.id);
// The planets' slugs in lesson order: a lesson inside First steps asks nothing
// of its own
const planetOrder = planetLessons(
  lessons
    .filter((l) => l.courseKey === LANIAKEA_COURSE)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((l) => l.slug),
).map((p) => p.slug);
const planets = new Set(planetOrder);
// The lesson that first teaches a kind of question, and each error a
// which-error question may name, so a planet before it never asks about it
// (CYB-106)
const KIND_FROM: Record<string, string> = { 'which-input': 'input', 'which-error': 'scope' };
const ERROR_FROM: Record<string, string> = {
  IndexError: 'lists',
  KeyError: 'dictionaries',
  TypeError: 'tuples',
  NameError: 'scope',
  SyntaxError: 'default-params',
  ValueError: 'try-except',
  ZeroDivisionError: 'try-except',
};

describe('Laniakea questions', () => {
  const slugs = quizSlugs();

  it('has questions for at least one lesson', () => {
    expect(slugs.length).toBeGreaterThan(0);
  });

  it.each(slugs)('%s belongs to a planet and reads in both languages', (slug) => {
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

  // A test takes at most QUIZ_SAME_TEXT questions with one text, so a pool
  // holds no text on more than that share of it: 30 of 100 (CYB-106)
  it.each(slugs)('%s has no text on more than its share of a test', (slug) => {
    const over: string[] = [];
    for (const lang of ['en', 'ro'] as const) {
      const pool = loadQuiz(slug, lang)!.questions;
      const limit = Math.floor((QUIZ_SAME_TEXT * pool.length) / QUIZ_LENGTH);
      const counts = new Map<string, number>();
      for (const q of pool) counts.set(q.text, (counts.get(q.text) ?? 0) + 1);
      for (const [text, n] of counts) {
        if (n > limit) over.push(`${lang}: "${text}" on ${n} of ${pool.length}, at most ${limit}`);
      }
    }
    expect(over).toEqual([]);
  });

  // A lesson that isn't a planet has no place in planetOrder, and indexOf's -1
  // would count it as taught everywhere
  it('names only planets as the lessons that teach a kind or an error', () => {
    const named = [...Object.values(KIND_FROM), ...Object.values(ERROR_FROM)];
    expect(named.filter((lesson) => !planets.has(lesson))).toEqual([]);
  });

  it.each(slugs)('%s asks only about what its lessons and the ones before teach', (slug) => {
    const taught = (lesson: string) => planetOrder.indexOf(lesson) <= planetOrder.indexOf(slug);
    const off: string[] = [];
    // The Romanian twins have the same kinds and the English ids
    for (const t of parseTemplates(read(quizFiles(slug, 'en').quiz))) {
      const from = KIND_FROM[t.kind];
      if (from && !taught(from)) off.push(`${t.id}: ${t.kind} comes with ${from}`);
      if (t.kind !== 'which-error') continue;
      const ids = new Set(t.values.map((values) => madeId(t, values)));
      for (const lang of ['en', 'ro'] as const) {
        const made = (read(quizFiles(slug, lang).made) as { questions?: QuizQuestionSpec[] })
          .questions;
        for (const q of (made ?? []).filter((q) => ids.has(q.id))) {
          for (const name of q.options) {
            if (!(name in ERROR_FROM)) off.push(`${q.id}: ${name} isn't taught`);
            else if (!taught(ERROR_FROM[name]))
              off.push(`${q.id}: ${name} comes with ${ERROR_FROM[name]}`);
          }
        }
      }
    }
    expect(off).toEqual([]);
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
