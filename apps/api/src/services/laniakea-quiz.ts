import fs from 'fs';
import path from 'path';
import { LANIAKEA_COURSE, QUIZ_LENGTH, QUIZ_OPTIONS } from '@cyberstars/shared/laniakea';
import { contentDir } from './paths.js';

// A lesson's questions for Laniakea live next to it as <slug>-quiz.json, with
// ro/<slug>-quiz.json in Romanian. They stay on the server like solutions (the
// static-content generator copies only markdown), so a student can't read the
// answers before a test.
//
//   { "questions": [{ "id": "q1", "text": "...", "code": "...", "options": [4], "answer": 0 }] }
//
// `code` is optional and `answer` is the right option's place. An id names one
// question for good, since the server remembers which ones a student has seen:
// a question that changes its meaning gets a new id. The Romanian file has the
// same questions, in the same order, with the same ids and right answers.
interface QuizQuestionSpec {
  id: string;
  text: string;
  code: string | null;
  options: string[];
  answer: number;
}

export interface QuizSpec {
  questions: QuizQuestionSpec[];
}

const QUIZ_SUFFIX = '-quiz.json';
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function text(value: unknown, where: string): string {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${where} has no text`);
  return value;
}

// Reads a quiz file's contents, or throws saying what is wrong with it.
export function parseQuiz(raw: unknown): QuizSpec {
  const list = (raw as { questions?: unknown } | null)?.questions;
  if (!Array.isArray(list)) throw new Error('no questions list');
  if (list.length < QUIZ_LENGTH) {
    throw new Error(`${list.length} questions, a test needs ${QUIZ_LENGTH}`);
  }
  const ids = new Set<string>();
  const questions = list.map((q: Record<string, unknown>, i): QuizQuestionSpec => {
    const where = `question ${i + 1}`;
    if (typeof q?.id !== 'string' || !ID.test(q.id)) throw new Error(`${where} has a bad id`);
    if (ids.has(q.id)) throw new Error(`${where} repeats the id ${q.id}`);
    ids.add(q.id);
    const options = q.options;
    if (!Array.isArray(options) || options.length !== QUIZ_OPTIONS) {
      throw new Error(`${q.id} needs ${QUIZ_OPTIONS} options`);
    }
    options.forEach((o, j) => text(o, `${q.id} option ${j + 1}`));
    if (new Set(options).size !== options.length) throw new Error(`${q.id} repeats an option`);
    if (
      !Number.isInteger(q.answer) ||
      (q.answer as number) < 0 ||
      (q.answer as number) >= QUIZ_OPTIONS
    ) {
      throw new Error(`${q.id} has no right option`);
    }
    if (q.code !== undefined && typeof q.code !== 'string') {
      throw new Error(`${q.id} has code that isn't text`);
    }
    return {
      id: q.id,
      text: text(q.text, q.id),
      code: (q.code as string | undefined) ?? null,
      options: options as string[],
      answer: q.answer as number,
    };
  });
  return { questions };
}

// What makes a Romanian file a translation of the English one, or [] when it is.
export function pairProblems(en: QuizSpec, ro: QuizSpec): string[] {
  const problems: string[] = [];
  if (en.questions.length !== ro.questions.length) {
    problems.push(
      `${en.questions.length} questions in English, ${ro.questions.length} in Romanian`,
    );
  }
  en.questions.forEach((q, i) => {
    const r = ro.questions[i];
    if (!r) return;
    if (r.id !== q.id)
      problems.push(`question ${i + 1} is ${q.id} in English, ${r.id} in Romanian`);
    else if (r.answer !== q.answer) problems.push(`${q.id} has another right option in Romanian`);
    else if ((r.code === null) !== (q.code === null)) {
      problems.push(`${q.id} has code in one language only`);
    }
  });
  return problems;
}

function quizPath(slug: string, lang: 'en' | 'ro'): string {
  const dir = contentDir(LANIAKEA_COURSE);
  return lang === 'ro'
    ? path.join(dir, 'ro', slug + QUIZ_SUFFIX)
    : path.join(dir, slug + QUIZ_SUFFIX);
}

// The lesson's questions in the page's language, the English ones when it has
// no Romanian, or null when the lesson has none.
export function loadQuiz(slug: string, lang: 'en' | 'ro'): QuizSpec | null {
  for (const file of lang === 'ro'
    ? [quizPath(slug, 'ro'), quizPath(slug, 'en')]
    : [quizPath(slug, 'en')]) {
    if (fs.existsSync(file)) return parseQuiz(JSON.parse(fs.readFileSync(file, 'utf8')));
  }
  return null;
}

export function hasQuiz(slug: string): boolean {
  return fs.existsSync(quizPath(slug, 'en'));
}

// The slugs of the lessons that have questions, read from the course's folder.
export function quizSlugs(): string[] {
  return fs
    .readdirSync(contentDir(LANIAKEA_COURSE))
    .filter((f) => f.endsWith(QUIZ_SUFFIX))
    .map((f) => f.slice(0, -QUIZ_SUFFIX.length));
}
