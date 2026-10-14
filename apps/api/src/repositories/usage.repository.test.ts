import { describe, it, expect, vi, beforeEach } from 'vitest';

const tx = {
  $queryRaw: vi.fn(),
  usageWindow: { createMany: vi.fn(), update: vi.fn() },
};

const mockPrisma = {
  $transaction: vi.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
  usageWindow: { findMany: vi.fn(), updateMany: vi.fn() },
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./usage.repository.js');

const HOUR = 60 * 60 * 1000;
const NOW = new Date('2026-10-15T12:00:00Z');
const at = (msAgo: number) => new Date(NOW.getTime() - msAgo);

beforeEach(() => vi.clearAllMocks());

describe('listForUser', () => {
  it("reads every window of the student's", async () => {
    mockPrisma.usageWindow.findMany.mockResolvedValue([]);
    await repo.listForUser(4);
    expect(mockPrisma.usageWindow.findMany).toHaveBeenCalledWith({
      where: { userId: 4 },
      select: { action: true, windowStart: true, used: true },
    });
  });
});

describe('take', () => {
  it('makes sure the row exists, then locks it before counting', async () => {
    tx.$queryRaw.mockResolvedValue([{ window_start: NOW, used: 0 }]);

    await repo.take(4, 'tutorMessage', 2, 30, 5 * HOUR, NOW);

    expect(tx.usageWindow.createMany).toHaveBeenCalledWith({
      data: [{ userId: 4, action: 'tutorMessage', windowStart: NOW, used: 0 }],
      skipDuplicates: true,
    });
    const sql = (tx.$queryRaw.mock.calls[0][0] as string[]).join('?');
    expect(sql).toContain('FOR UPDATE');
  });

  it('adds to a live window', async () => {
    tx.$queryRaw.mockResolvedValue([{ window_start: at(HOUR), used: 5 }]);

    const taken = await repo.take(4, 'tutorMessage', 2, 30, 5 * HOUR, NOW);

    expect(taken).toEqual({ windowStart: at(HOUR), used: 7, taken: 2 });
    expect(tx.usageWindow.update).toHaveBeenCalledWith({
      where: { userId_action: { userId: 4, action: 'tutorMessage' } },
      data: { windowStart: at(HOUR), used: 7 },
    });
  });

  it('takes only what is left under the limit', async () => {
    tx.$queryRaw.mockResolvedValue([{ window_start: at(HOUR), used: 29 }]);
    const taken = await repo.take(4, 'tutorMessage', 2, 30, 5 * HOUR, NOW);
    expect(taken).toEqual({ windowStart: at(HOUR), used: 30, taken: 1 });
  });

  it('takes nothing, and writes nothing, at the limit', async () => {
    tx.$queryRaw.mockResolvedValue([{ window_start: at(HOUR), used: 30 }]);
    const taken = await repo.take(4, 'tutorMessage', 2, 30, 5 * HOUR, NOW);
    expect(taken).toEqual({ windowStart: at(HOUR), used: 30, taken: 0 });
    expect(tx.usageWindow.update).not.toHaveBeenCalled();
  });

  it('opens a new window once the old one has ended', async () => {
    tx.$queryRaw.mockResolvedValue([{ window_start: at(5 * HOUR), used: 30 }]);

    const taken = await repo.take(4, 'tutorMessage', 2, 30, 5 * HOUR, NOW);

    expect(taken).toEqual({ windowStart: NOW, used: 2, taken: 2 });
    expect(tx.usageWindow.update).toHaveBeenCalledWith({
      where: { userId_action: { userId: 4, action: 'tutorMessage' } },
      data: { windowStart: NOW, used: 2 },
    });
  });
});

describe('giveBack', () => {
  it('only touches the window the units were taken from', async () => {
    await repo.giveBack(4, 'tutorMessage', at(HOUR), 1);
    expect(mockPrisma.usageWindow.updateMany).toHaveBeenCalledWith({
      where: { userId: 4, action: 'tutorMessage', windowStart: at(HOUR) },
      data: { used: { decrement: 1 } },
    });
  });
});
