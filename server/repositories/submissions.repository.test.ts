import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Prisma } from '@prisma/client';

const tx = {
  lessonSubmission: {
    create: vi.fn(),
    findMany: vi.fn(),
    deleteMany: vi.fn(),
  },
};

const mockPrisma = {
  $transaction: vi.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
  lessonSubmission: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
  },
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./submissions.repository.js');

const input: Parameters<typeof repo.createAndPrune>[0] = {
  userId: 7,
  courseKey: 'python',
  lessonSlug: 'print',
  status: 'failed',
  passedCount: 1,
  total: 3,
  runtimeMs: 12.5,
  referenceMs: 10.25,
  lang: 'en',
  code: 'print(1)',
  syntaxError: null,
  structureFailures: [],
  failedCase: { index: 1, visible: true, passed: false },
};

beforeEach(() => vi.clearAllMocks());

describe('createAndPrune', () => {
  it('inserts the attempt and prunes everything older than the cap in one transaction', async () => {
    tx.lessonSubmission.create.mockResolvedValue({ id: 30 });
    tx.lessonSubmission.findMany.mockResolvedValue([{ id: 10 }]);

    expect(await repo.createAndPrune(input, 20)).toEqual({ id: 30 });

    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.lessonSubmission.create).toHaveBeenCalledWith({ data: input });
    expect(tx.lessonSubmission.findMany).toHaveBeenCalledWith({
      where: { userId: 7, courseKey: 'python', lessonSlug: 'print' },
      orderBy: { id: 'desc' },
      skip: 20,
      take: 1,
      select: { id: true },
    });
    expect(tx.lessonSubmission.deleteMany).toHaveBeenCalledWith({
      where: { userId: 7, courseKey: 'python', lessonSlug: 'print', id: { lte: 10 } },
    });
  });

  it('deletes nothing while the history is under the cap', async () => {
    tx.lessonSubmission.create.mockResolvedValue({ id: 3 });
    tx.lessonSubmission.findMany.mockResolvedValue([]);

    await repo.createAndPrune(input, 20);

    expect(tx.lessonSubmission.deleteMany).not.toHaveBeenCalled();
  });

  it('stores a database null when no case failed', async () => {
    tx.lessonSubmission.create.mockResolvedValue({ id: 4 });
    tx.lessonSubmission.findMany.mockResolvedValue([]);

    await repo.createAndPrune({ ...input, failedCase: null }, 20);

    expect(tx.lessonSubmission.create).toHaveBeenCalledWith({
      data: { ...input, failedCase: Prisma.JsonNull },
    });
  });
});

describe('listForLesson', () => {
  it("lists the user's attempts on the lesson newest first, without the code", async () => {
    mockPrisma.lessonSubmission.findMany.mockResolvedValue([{ id: 2 }, { id: 1 }]);

    expect(await repo.listForLesson(7, 'python', 'print')).toEqual([{ id: 2 }, { id: 1 }]);

    const args = mockPrisma.lessonSubmission.findMany.mock.calls[0][0];
    expect(args.where).toEqual({ userId: 7, courseKey: 'python', lessonSlug: 'print' });
    expect(args.orderBy).toEqual({ id: 'desc' });
    expect(args.select.code).toBeUndefined();
    expect(args.select.createdAt).toBe(true);
  });
});

describe('findOwned', () => {
  it('scopes the lookup to the owner', async () => {
    mockPrisma.lessonSubmission.findFirst.mockResolvedValue(null);

    expect(await repo.findOwned(7, 5)).toBeNull();
    expect(mockPrisma.lessonSubmission.findFirst).toHaveBeenCalledWith({
      where: { id: 5, userId: 7 },
    });
  });
});
