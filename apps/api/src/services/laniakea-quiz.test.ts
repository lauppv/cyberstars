import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'laniakea-quiz-'));
vi.mock('./paths.js', () => ({ contentDir: () => dir }));

const { hasQuiz, loadQuiz, pairProblems, parseQuiz, quizSlugs } =
  await import('./laniakea-quiz.js');

function question(i: number, over: Record<string, unknown> = {}) {
  return { id: `q${i}`, text: `Question ${i}?`, options: ['a', 'b', 'c', 'd'], answer: 1, ...over };
}
const pool = (n = 10) => Array.from({ length: n }, (_, i) => question(i + 1));

describe('parseQuiz', () => {
  it('reads a pool, code left out as null', () => {
    const spec = parseQuiz({
      questions: [question(1, { code: 'print(1)' }), ...pool(10).slice(1)],
    });
    expect(spec.questions).toHaveLength(10);
    expect(spec.questions[0]).toEqual({
      id: 'q1',
      text: 'Question 1?',
      code: 'print(1)',
      options: ['a', 'b', 'c', 'd'],
      answer: 1,
    });
    expect(spec.questions[1].code).toBeNull();
  });

  it.each([
    [null, 'no questions list'],
    [{ questions: pool(9) }, '9 questions, a test needs 10'],
    [{ questions: [question(1, { id: 'Q 1' }), ...pool(10)] }, 'question 1 has a bad id'],
    [{ questions: [...pool(10), question(3)] }, 'question 11 repeats the id q3'],
    [{ questions: [question(1, { options: ['a', 'b'] }), ...pool(10)] }, 'q1 needs 4 options'],
    [
      { questions: [question(1, { options: ['a', 'b', ' ', 'd'] }), ...pool(10)] },
      'q1 option 3 has no text',
    ],
    [
      { questions: [question(1, { options: ['a', 'b', 'a', 'd'] }), ...pool(10)] },
      'q1 repeats an option',
    ],
    [{ questions: [question(1, { answer: 4 }), ...pool(10)] }, 'q1 has no right option'],
    [{ questions: [question(1, { answer: 1.5 }), ...pool(10)] }, 'q1 has no right option'],
    [{ questions: [question(1, { code: 3 }), ...pool(10)] }, "q1 has code that isn't text"],
    [{ questions: [question(1, { text: '' }), ...pool(10)] }, 'q1 has no text'],
  ])('refuses a broken file (%#)', (raw, message) => {
    expect(() => parseQuiz(raw)).toThrow(message);
  });
});

describe('pairProblems', () => {
  const en = parseQuiz({ questions: [question(1, { code: 'x = 1' }), ...pool(10).slice(1)] });

  it('takes a translation with the same questions and right answers', () => {
    const ro = parseQuiz({
      questions: [question(1, { code: 'y = 1', text: 'Intrebarea 1?' }), ...pool(10).slice(1)],
    });
    expect(pairProblems(en, ro)).toEqual([]);
  });

  it('names what differs', () => {
    const ro = parseQuiz({
      questions: [
        question(1),
        question(2),
        question(3, { answer: 2 }),
        question(4, { id: 'q40' }),
        ...pool(11).slice(4),
      ],
    });
    expect(pairProblems(en, ro)).toEqual([
      '10 questions in English, 11 in Romanian',
      'q1 has code in one language only',
      'q3 has another right option in Romanian',
      'question 4 is q4 in English, q40 in Romanian',
    ]);
  });
});

describe('loading a lesson', () => {
  beforeAll(() => {
    fs.mkdirSync(path.join(dir, 'ro'));
    fs.writeFileSync(path.join(dir, 'print-quiz.json'), JSON.stringify({ questions: pool() }));
    const ro = pool().map((q) => ({ ...q, text: q.text.replace('Question', 'Intrebarea') }));
    fs.writeFileSync(path.join(dir, 'ro', 'print-quiz.json'), JSON.stringify({ questions: ro }));
    fs.writeFileSync(path.join(dir, 'lists-quiz.json'), JSON.stringify({ questions: pool() }));
    fs.writeFileSync(path.join(dir, 'lists.md'), '# Lists');
  });
  afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

  it('reads the questions in the page language, English when there is no translation', () => {
    expect(loadQuiz('print', 'ro')?.questions[0].text).toBe('Intrebarea 1?');
    expect(loadQuiz('print', 'en')?.questions[0].text).toBe('Question 1?');
    expect(loadQuiz('lists', 'ro')?.questions[0].text).toBe('Question 1?');
  });

  it('has nothing for a lesson without questions', () => {
    expect(loadQuiz('for', 'en')).toBeNull();
    expect(loadQuiz('for', 'ro')).toBeNull();
    expect(hasQuiz('for')).toBe(false);
    expect(hasQuiz('print')).toBe(true);
  });

  it('lists the lessons that have questions', () => {
    expect(quizSlugs().sort()).toEqual(['lists', 'print']);
  });
});
