import fs from 'fs';
import path from 'path';
import { LANIAKEA_COURSE, QUIZ_LENGTH, QUIZ_OPTIONS } from '@cyberstars/shared/laniakea';
import { contentDir } from './paths.js';

// A lesson's questions for Laniakea live next to it as <slug>-quiz.json, with
// ro/<slug>-quiz.json in Romanian. They stay on the server like solutions (the
// static-content generator copies only markdown), so a student can't read the
// answers before a test.
//
//   { "questions": [{ "id": "q1", "text": "...", "code": "...", "output": "...", "options": [4], "answer": 0 }],
//     "templates": [...] }
//
// `code` and `output` are optional and `answer` is the right option's place. An
// id names one question for good, since the server remembers which ones a
// student has seen: a question that changes its meaning gets a new id. The
// Romanian file has the same questions, in the same order, with the same ids and
// right answers.
//
// `templates` make more questions from code (laniakea-templates.ts): `npm run
// make:quiz` runs them with Python and writes what they make to
// <slug>-quiz-made.json beside the quiz file, in the same shape. A lesson's pool
// is both files' questions, so a lesson may have only templates.
export interface QuizQuestionSpec {
  id: string;
  text: string;
  code: string | null;
  output: string | null;
  options: string[];
  answer: number;
}

export interface QuizSpec {
  questions: QuizQuestionSpec[];
}

const QUIZ_SUFFIX = '-quiz.json';
const MADE_SUFFIX = '-quiz-made.json';
export const QUIZ_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function text(value: unknown, where: string): string {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${where} has no text`);
  return value;
}

// The questions a quiz file holds: none when it has only templates.
function questionsIn(raw: unknown): Record<string, unknown>[] {
  if (typeof raw !== 'object' || raw === null) throw new Error('no questions list');
  const list = (raw as { questions?: unknown }).questions;
  if (list === undefined) return [];
  if (!Array.isArray(list)) throw new Error('no questions list');
  return list as Record<string, unknown>[];
}

// Reads a lesson's pool from its files' contents (the quiz file, then the made
// questions), or throws saying what is wrong with it.
export function parseQuiz(...files: unknown[]): QuizSpec {
  const list = files.flatMap(questionsIn);
  if (list.length < QUIZ_LENGTH) {
    throw new Error(`${list.length} questions, a test needs ${QUIZ_LENGTH}`);
  }
  const ids = new Set<string>();
  const questions = list.map((q: Record<string, unknown>, i): QuizQuestionSpec => {
    const where = `question ${i + 1}`;
    if (typeof q?.id !== 'string' || !QUIZ_ID.test(q.id)) throw new Error(`${where} has a bad id`);
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
    if (q.output !== undefined) text(q.output, `${q.id} output`);
    return {
      id: q.id,
      text: text(q.text, q.id),
      code: (q.code as string | undefined) ?? null,
      output: (q.output as string | undefined) ?? null,
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
    } else if ((r.output === null) !== (q.output === null)) {
      problems.push(`${q.id} has an output in one language only`);
    }
  });
  return problems;
}

function quizPath(slug: string, lang: 'en' | 'ro', suffix = QUIZ_SUFFIX): string {
  const dir = contentDir(LANIAKEA_COURSE);
  return lang === 'ro' ? path.join(dir, 'ro', slug + suffix) : path.join(dir, slug + suffix);
}

// Where a lesson's questions are in one language: the quiz file (questions and
// templates) and the made questions beside it.
export function quizFiles(slug: string, lang: 'en' | 'ro'): { quiz: string; made: string } {
  return { quiz: quizPath(slug, lang), made: quizPath(slug, lang, MADE_SUFFIX) };
}

function readJson(file: string): unknown {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

// The lesson's questions in the page's language, the English ones when it has
// no Romanian, or null when the lesson has none.
export function loadQuiz(slug: string, lang: 'en' | 'ro'): QuizSpec | null {
  for (const files of lang === 'ro'
    ? [quizFiles(slug, 'ro'), quizFiles(slug, 'en')]
    : [quizFiles(slug, 'en')]) {
    if (fs.existsSync(files.quiz)) return parseQuiz(readJson(files.quiz), readJson(files.made));
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
