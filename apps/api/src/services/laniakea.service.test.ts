import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { PlanetRow, StoredQuiz } from '../repositories/laniakea.repository.js';

const mockProgress = { getByCourse: vi.fn() };
const mockRepo = { listPlanets: vi.fn(), withPlanet: vi.fn() };
const mockQuiz = { loadQuiz: vi.fn(), quizSlugs: vi.fn() };

vi.mock('../repositories/progress.repository.js', () => mockProgress);
vi.mock('../repositories/laniakea.repository.js', () => mockRepo);
vi.mock('./laniakea-quiz.js', () => mockQuiz);

const service = await import('./laniakea.service.js');
const { config } = await import('../config/index.js');
const { DAY_MS, QUIZ_IDLE_MS, QUIZ_RETRY_MS } = await import('@cyberstars/shared/laniakea');

const NOW = new Date('2026-10-24T12:00:00Z');
const ago = (ms: number) => new Date(NOW.getTime() - ms);

// Twelve questions, the first with code and the second with an output; the
// first option is always the right one.
function spec(word: string, n = 12) {
  return {
    questions: Array.from({ length: n }, (_, i) => ({
      id: `q${i + 1}`,
      text: `${word} ${i + 1}?`,
      code: i === 0 ? 'print(1)' : null,
      output: i === 1 ? '1' : null,
      options: ['right', 'w1', 'w2', 'w3'].map((o) => `${o}-${i + 1}`),
      answer: 0,
    })),
  };
}
const EN = spec('Question');
const RO = spec('Intrebarea');

function done(...slugs: string[]) {
  return slugs.map((lessonSlug) => ({ lessonSlug, completed: true }));
}

function planet(over: Partial<PlanetRow> = {}): PlanetRow {
  return {
    lessonSlug: 'print',
    level: 0,
    passedAt: null,
    retryAt: null,
    seen: [],
    quiz: null,
    quizAt: null,
    ...over,
  };
}

// The planet the transaction sees, and what it decided to write
let row: PlanetRow;
let written: Partial<PlanetRow> | null;

beforeEach(() => {
  vi.clearAllMocks();
  row = planet();
  written = null;
  mockProgress.getByCourse.mockResolvedValue(done('print', 'variables-str', 'variables-int'));
  mockQuiz.loadQuiz.mockImplementation((_slug: string, lang: string) => (lang === 'ro' ? RO : EN));
  mockQuiz.quizSlugs.mockReturnValue(['print', 'variables-str']);
  mockRepo.listPlanets.mockResolvedValue([]);
  mockRepo.withPlanet.mockImplementation(
    async (
      _u: number,
      _c: string,
      _s: string,
      decide: (r: PlanetRow) => { change: Partial<PlanetRow> | null; result: unknown },
    ) => {
      const { change, result } = decide(row);
      written = change;
      if (change) row = { ...row, ...change };
      return result;
    },
  );
});

afterEach(() => {
  delete process.env.LANIAKEA_DAY_MS;
  Object.assign(config, { isProduction: false });
});

describe('drawQuestions', () => {
  const pool = ['a', 'b', 'c', 'd', 'e', 'f'];

  it('draws only questions not seen in this round', () => {
    const drawn = service.drawQuestions(pool, ['a', 'b'], 3);
    expect(drawn.ids).toHaveLength(3);
    expect(drawn.ids.every((id) => !['a', 'b'].includes(id))).toBe(true);
    expect(drawn.seen).toEqual(['a', 'b']);
  });

  it('starts a new round with those left first and no question twice', () => {
    const drawn = service.drawQuestions(pool, ['a', 'b', 'c', 'd'], 4);
    expect(drawn.ids).toEqual(expect.arrayContaining(['e', 'f']));
    expect(new Set(drawn.ids).size).toBe(4);
    expect(drawn.seen).toEqual([]);
  });

  it('forgets seen questions the lesson no longer has', () => {
    const drawn = service.drawQuestions(pool, ['a', 'gone'], 2);
    expect(drawn.seen).toEqual(['a']);
  });
});

describe('afterPass', () => {
  it('conquers a new planet', () => {
    expect(service.afterPass(0, null, NOW)).toEqual({ level: 1, passedAt: NOW, leveledUp: true });
  });

  it('moves up once the recap is open, not before', () => {
    expect(service.afterPass(1, ago(DAY_MS), NOW)).toEqual({
      level: 2,
      passedAt: NOW,
      leveledUp: true,
    });
    const early = ago(DAY_MS - 1);
    expect(service.afterPass(1, early, NOW)).toEqual({
      level: 1,
      passedAt: early,
      leveledUp: false,
    });
  });

  it('leaves a planet kept for good as it is', () => {
    expect(service.afterPass(8, ago(400 * DAY_MS), NOW).leveledUp).toBe(false);
  });
});

describe('quizMode', () => {
  it('tells a conquest, a recap and practice apart', () => {
    expect(service.quizMode(0, null, NOW)).toBe('conquer');
    expect(service.quizMode(3, ago(4 * DAY_MS), NOW)).toBe('recap');
    expect(service.quizMode(3, ago(DAY_MS), NOW)).toBe('practice');
    expect(service.quizMode(8, ago(DAY_MS), NOW)).toBe('practice');
  });
});

describe('planetView', () => {
  it('drops a retry time that has passed', () => {
    expect(
      service.planetView('print', planet({ retryAt: ago(1) }), true, true, NOW).retryAt,
    ).toBeNull();
    const later = new Date(NOW.getTime() + 1000);
    expect(service.planetView('print', planet({ retryAt: later }), true, true, NOW).retryAt).toBe(
      later.toISOString(),
    );
  });

  it('shows a planet never touched as not conquered', () => {
    expect(service.planetView('print', undefined, false, false, NOW)).toEqual({
      slug: 'print',
      lessonDone: false,
      hasQuiz: false,
      level: 0,
      passedAt: null,
      nextRecapAt: null,
      retryAt: null,
    });
  });
});

describe('getState', () => {
  it('opens the game after three lessons of the course', async () => {
    mockProgress.getByCourse.mockResolvedValue([
      ...done('print', 'variables-str'),
      { lessonSlug: 'variables-int', completed: false },
    ]);
    const locked = await service.getState(4, NOW);
    expect(locked.unlocked).toBe(false);
    expect(locked.lessonsDone).toBe(2);
    expect(locked.unlockAt).toBe(3);

    mockProgress.getByCourse.mockResolvedValue(done('print', 'variables-str', 'variables-int'));
    expect((await service.getState(4, NOW)).unlocked).toBe(true);
    expect(mockProgress.getByCourse).toHaveBeenCalledWith(4, 'python');
  });

  it('lists every lesson of the course as a planet, in order', async () => {
    mockRepo.listPlanets.mockResolvedValue([planet({ level: 2, passedAt: ago(DAY_MS) })]);

    const state = await service.getState(4, NOW);

    expect(state.planets).toHaveLength(60);
    expect(state.planets[0]).toEqual({
      slug: 'print',
      lessonDone: true,
      hasQuiz: true,
      level: 2,
      passedAt: ago(DAY_MS).toISOString(),
      nextRecapAt: new Date(NOW.getTime() + DAY_MS).toISOString(),
      retryAt: null,
    });
    expect(state.planets[3]).toMatchObject({ slug: 'print-f', lessonDone: false, hasQuiz: false });
    expect(state.serverNow).toBe(NOW.toISOString());
  });

  it('takes a shorter day on dev, never on prod', async () => {
    mockRepo.listPlanets.mockResolvedValue([planet({ level: 1, passedAt: NOW })]);
    process.env.LANIAKEA_DAY_MS = '60000';
    expect((await service.getState(4, NOW)).planets[0].nextRecapAt).toBe(
      new Date(NOW.getTime() + 60000).toISOString(),
    );
    Object.assign(config, { isProduction: true });
    expect((await service.getState(4, NOW)).planets[0].nextRecapAt).toBe(
      new Date(NOW.getTime() + DAY_MS).toISOString(),
    );
  });
});

describe('startQuiz', () => {
  it('refuses a lesson that is no planet', async () => {
    await expect(service.startQuiz(4, '../x', 'en', NOW)).rejects.toMatchObject({
      statusCode: 404,
      message: 'Planet not found',
    });
  });

  it('keeps the game closed before three lessons', async () => {
    mockProgress.getByCourse.mockResolvedValue(done('print'));
    await expect(service.startQuiz(4, 'print', 'en', NOW)).rejects.toMatchObject({
      statusCode: 403,
      message: 'Laniakea is still locked',
    });
  });

  it("refuses a planet whose lesson isn't done", async () => {
    await expect(service.startQuiz(4, 'for', 'en', NOW)).rejects.toMatchObject({
      statusCode: 403,
      message: 'Finish this lesson to reach its planet',
    });
  });

  it('refuses a planet without questions', async () => {
    mockQuiz.loadQuiz.mockReturnValue(null);
    await expect(service.startQuiz(4, 'print', 'en', NOW)).rejects.toMatchObject({
      statusCode: 404,
      message: 'This planet has no questions yet',
    });
  });

  it('draws ten questions with their options shuffled, in the page language', async () => {
    const view = await service.startQuiz(4, 'print', 'ro', NOW);

    expect(view.slug).toBe('print');
    expect(view.mode).toBe('conquer');
    expect(view.questions).toHaveLength(10);
    expect(view.answers).toEqual([]);
    const quiz = written!.quiz as StoredQuiz;
    expect(new Set(quiz.ids).size).toBe(10);
    quiz.ids.forEach((id, i) => {
      const n = Number(id.slice(1));
      expect(view.questions[i].text).toBe(`Intrebarea ${n}?`);
      expect(view.questions[i].code).toBe(RO.questions[n - 1].code);
      expect(view.questions[i].output).toBe(RO.questions[n - 1].output);
      expect(view.questions[i].options).toEqual(
        quiz.orders[i].map((k) => EN.questions[n - 1].options[k]),
      );
      expect([...quiz.orders[i]].sort()).toEqual([0, 1, 2, 3]);
    });
    expect(written).toMatchObject({ quizAt: NOW, seen: [], retryAt: null });
  });

  it('picks up a test still going on where it was', async () => {
    await service.startQuiz(4, 'print', 'en', NOW);
    const first = row.quiz!;
    row = { ...row, quiz: { ...first, answers: [first.orders[0].indexOf(0)] } };

    const view = await service.startQuiz(4, 'print', 'en', new Date(NOW.getTime() + 60_000));

    expect(written).toBeNull();
    expect(row.quiz!.ids).toEqual(first.ids);
    expect(view.answers).toEqual([
      {
        choice: first.orders[0].indexOf(0),
        correct: true,
        correctChoice: first.orders[0].indexOf(0),
      },
    ]);
  });

  it('drops a test left untouched too long, or drawn from questions now gone', async () => {
    row = planet({
      quiz: { ids: ['q1'], orders: [[0, 1, 2, 3]], answers: [] },
      quizAt: ago(QUIZ_IDLE_MS),
    });
    await service.startQuiz(4, 'print', 'en', NOW);
    expect((written!.quiz as StoredQuiz).ids).toHaveLength(10);

    row = planet({ quiz: { ids: ['gone'], orders: [[0, 1, 2, 3]], answers: [] }, quizAt: NOW });
    await service.startQuiz(4, 'print', 'en', NOW);
    expect((written!.quiz as StoredQuiz).ids).toHaveLength(10);
  });

  it('waits out the pause after a failed test', async () => {
    row = planet({ retryAt: new Date(NOW.getTime() + 1000) });
    await expect(service.startQuiz(4, 'print', 'en', NOW)).rejects.toMatchObject({
      statusCode: 409,
      message: 'This planet opens for another try soon',
    });
    row = planet({ retryAt: NOW });
    await expect(service.startQuiz(4, 'print', 'en', NOW)).resolves.toBeTruthy();
  });

  it('tells a recap from practice', async () => {
    row = planet({ level: 2, passedAt: ago(2 * DAY_MS) });
    expect((await service.startQuiz(4, 'print', 'en', NOW)).mode).toBe('recap');
    row = planet({ level: 2, passedAt: ago(DAY_MS) });
    expect((await service.startQuiz(4, 'print', 'en', NOW)).mode).toBe('practice');
  });
});

describe('answerQuiz', () => {
  // A test under way on the planet: the right option's place in each question
  async function started(over: Partial<PlanetRow> = {}): Promise<number[]> {
    row = planet(over);
    await service.startQuiz(4, 'print', 'en', NOW);
    return row.quiz!.orders.map((order) => order.indexOf(0));
  }
  const wrong = (right: number) => (right + 1) % 4;

  it('says at once whether the answer was right', async () => {
    const right = await started();

    const hit = await service.answerQuiz(4, 'print', 0, right[0], NOW);
    const miss = await service.answerQuiz(4, 'print', 1, wrong(right[1]), NOW);

    expect(hit).toEqual({
      choice: right[0],
      correct: true,
      correctChoice: right[0],
      status: 'active',
      planet: null,
      leveledUp: false,
    });
    expect(miss).toMatchObject({ correct: false, correctChoice: right[1], status: 'active' });
    expect(row.quiz!.answers).toEqual([right[0], wrong(right[1])]);
    expect(row.seen).toEqual(row.quiz!.ids.slice(0, 2));
  });

  it('gives the same reply to an answer sent twice', async () => {
    const right = await started();
    await service.answerQuiz(4, 'print', 0, right[0], NOW);

    const again = await service.answerQuiz(4, 'print', 0, wrong(right[0]), NOW);

    expect(again).toMatchObject({ choice: right[0], correct: true });
    expect(written).toBeNull();
  });

  it('takes the questions in order only', async () => {
    await started();
    await expect(service.answerQuiz(4, 'print', 2, 0, NOW)).rejects.toMatchObject({
      statusCode: 409,
      message: 'Answer the questions in order',
    });
  });

  it('has nothing to answer once the test is over', async () => {
    await expect(service.answerQuiz(4, 'print', 0, 0, NOW)).rejects.toMatchObject({
      statusCode: 404,
      message: 'This test is over',
    });
  });

  it('fails the test at the fifth wrong answer and holds the planet a while', async () => {
    const right = await started();
    for (let i = 0; i < 4; i++) await service.answerQuiz(4, 'print', i, wrong(right[i]), NOW);

    const out = await service.answerQuiz(4, 'print', 4, wrong(right[4]), NOW);

    const retryAt = new Date(NOW.getTime() + QUIZ_RETRY_MS).toISOString();
    expect(out).toMatchObject({ status: 'failed', leveledUp: false });
    expect(out.planet).toMatchObject({ level: 0, retryAt });
    expect(row).toMatchObject({ quiz: null, quizAt: null, level: 0 });
    expect(row.seen).toHaveLength(5);
  });

  it('conquers the planet with four wrong answers and six right', async () => {
    const right = await started();
    let last;
    for (let i = 0; i < 10; i++) {
      last = await service.answerQuiz(4, 'print', i, i < 4 ? wrong(right[i]) : right[i], NOW);
    }

    expect(last).toMatchObject({ status: 'passed', leveledUp: true });
    expect(last!.planet).toMatchObject({ level: 1, passedAt: NOW.toISOString(), retryAt: null });
    expect(row).toMatchObject({ level: 1, passedAt: NOW, quiz: null, retryAt: null });
  });

  it('leaves the planet as it was after practice', async () => {
    const passedAt = ago(DAY_MS / 2);
    const right = await started({ level: 1, passedAt });
    let last;
    for (let i = 0; i < 10; i++) last = await service.answerQuiz(4, 'print', i, right[i], NOW);

    expect(last).toMatchObject({ status: 'passed', leveledUp: false });
    expect(row).toMatchObject({ level: 1, passedAt });
  });

  it('refuses a lesson without questions', async () => {
    mockQuiz.loadQuiz.mockReturnValue(null);
    await expect(service.answerQuiz(4, 'print', 0, 0, NOW)).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
