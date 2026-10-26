import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Prisma } from '@prisma/client';

const tx = {
  $queryRaw: vi.fn(),
  $executeRaw: vi.fn(),
  laniakeaPlanet: { createMany: vi.fn(), update: vi.fn() },
};

const mockPrisma = {
  $transaction: vi.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
  laniakeaPlanet: { findMany: vi.fn() },
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./laniakea.repository.js');

const NOW = new Date('2026-10-24T12:00:00Z');
const QUIZ = { ids: ['q1'], orders: [[2, 0, 1, 3]], answers: [] };

beforeEach(() => vi.clearAllMocks());

describe('listPlanets', () => {
  it("reads the student's planets of the course", async () => {
    mockPrisma.laniakeaPlanet.findMany.mockResolvedValue([
      { lessonSlug: 'print', level: 1, quiz: QUIZ },
    ]);

    const rows = await repo.listPlanets(4, 'python');

    expect(rows).toEqual([{ lessonSlug: 'print', level: 1, quiz: QUIZ }]);
    expect(mockPrisma.laniakeaPlanet.findMany.mock.calls[0][0].where).toEqual({
      userId: 4,
      courseKey: 'python',
    });
  });
});

describe('withPlanet', () => {
  const stored = {
    level: 2,
    passed_at: NOW,
    retry_at: null,
    seen: ['q3'],
    quiz: QUIZ,
    quiz_at: NOW,
  };

  it('makes the planet if it is new, then locks it before deciding', async () => {
    tx.$queryRaw.mockResolvedValue([stored]);
    const decide = vi.fn(() => ({ change: null, result: 'kept' }));

    expect(await repo.withPlanet(4, 'python', 'print', decide)).toBe('kept');

    expect(tx.laniakeaPlanet.createMany).toHaveBeenCalledWith({
      data: [{ userId: 4, courseKey: 'python', lessonSlug: 'print' }],
      skipDuplicates: true,
    });
    expect((tx.$queryRaw.mock.calls[0][0] as string[]).join('?')).toContain('FOR UPDATE');
    expect(decide).toHaveBeenCalledWith({
      lessonSlug: 'print',
      level: 2,
      passedAt: NOW,
      retryAt: null,
      seen: ['q3'],
      quiz: QUIZ,
      quizAt: NOW,
    });
    expect(tx.laniakeaPlanet.update).not.toHaveBeenCalled();
  });

  it('reads a planet without seen questions as an empty list', async () => {
    tx.$queryRaw.mockResolvedValue([{ ...stored, seen: null }]);
    const decide = vi.fn((_row: { seen: string[] }) => ({ change: null, result: null }));

    await repo.withPlanet(4, 'python', 'print', decide);

    expect(decide.mock.calls[0][0].seen).toEqual([]);
  });

  it('writes what was decided, a finished test as no test at all', async () => {
    tx.$queryRaw.mockResolvedValue([stored]);

    await repo.withPlanet(4, 'python', 'print', () => ({
      change: { level: 3, passedAt: NOW, quiz: null, quizAt: null },
      result: null,
    }));

    expect(tx.laniakeaPlanet.update).toHaveBeenCalledWith({
      where: {
        userId_courseKey_lessonSlug: { userId: 4, courseKey: 'python', lessonSlug: 'print' },
      },
      data: { level: 3, passedAt: NOW, quiz: Prisma.DbNull, quizAt: null },
    });
  });

  it('writes a new test as it is, and leaves the test alone when not asked', async () => {
    tx.$queryRaw.mockResolvedValue([stored]);

    await repo.withPlanet(4, 'python', 'print', () => ({
      change: { quiz: QUIZ, quizAt: NOW },
      result: null,
    }));
    await repo.withPlanet(4, 'python', 'print', () => ({
      change: { retryAt: NOW },
      result: null,
    }));

    expect(tx.laniakeaPlanet.update.mock.calls[0][0].data).toEqual({ quiz: QUIZ, quizAt: NOW });
    expect(tx.laniakeaPlanet.update.mock.calls[1][0].data).toEqual({ retryAt: NOW });
  });

  it('counts an answer in the same transaction, each option in its own place', async () => {
    tx.$queryRaw.mockResolvedValue([stored]);

    await repo.withPlanet(4, 'python', 'print', () => ({
      change: { quizAt: NOW },
      counted: { questionId: 'q7', pick: 2, correct: false },
      result: null,
    }));

    const [sql, ...values] = tx.$executeRaw.mock.calls[0] as [string[], ...unknown[]];
    expect(sql.join('?')).toContain('ON CONFLICT (course_key, lesson_slug, question_id)');
    expect(values).toEqual(['python', 'print', 'q7', 1, [0, 0, 1, 0], 3, 3]);
  });

  it('counts a right answer as not wrong, and nothing when there is no answer', async () => {
    tx.$queryRaw.mockResolvedValue([stored]);

    await repo.withPlanet(4, 'python', 'print', () => ({ change: null, result: null }));
    await repo.withPlanet(4, 'python', 'print', () => ({
      change: null,
      counted: { questionId: 'q1', pick: 0, correct: true },
      result: null,
    }));

    expect(tx.$executeRaw).toHaveBeenCalledTimes(1);
    expect(tx.$executeRaw.mock.calls[0].slice(1)).toEqual([
      'python',
      'print',
      'q1',
      0,
      [1, 0, 0, 0],
      1,
      1,
    ]);
  });
});
