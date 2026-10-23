import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import { USAGE_LIMITS, USAGE_WINDOWS_MS } from '@cyberstars/shared/usage';

const DAY = USAGE_WINDOWS_MS.showSolution;

const mockRepo = { listForUser: vi.fn(), take: vi.fn(), giveBack: vi.fn() };
vi.mock('../repositories/usage.repository.js', () => mockRepo);

const { getSummary, hold, release, consume } = await import('./usage.service.js');

const NOW = new Date('2026-10-15T12:00:00Z');

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
  mockRepo.listForUser.mockResolvedValue([]);
});
afterEach(() => vi.useRealTimers());

describe('getSummary', () => {
  it('starts with a full budget and no window', async () => {
    const summary = await getSummary(1, false);
    expect(summary.showSolution).toEqual({
      used: 0,
      limit: USAGE_LIMITS.showSolution,
      remaining: USAGE_LIMITS.showSolution,
      resetAt: null,
      unlimited: false,
    });
  });

  it("reads each action's live window", async () => {
    const windowStart = new Date(NOW.getTime() - 60_000);
    mockRepo.listForUser.mockResolvedValue([{ action: 'showSolution', windowStart, used: 2 }]);

    const summary = await getSummary(1, false);

    expect(mockRepo.listForUser).toHaveBeenCalledWith(1);
    expect(summary.showSolution).toMatchObject({
      used: 2,
      remaining: USAGE_LIMITS.showSolution - 2,
      resetAt: new Date(windowStart.getTime() + DAY).toISOString(),
    });
    expect(summary.tutorMessage.used).toBe(0);
  });

  it('counts an ended window as unused', async () => {
    const windowStart = new Date(NOW.getTime() - DAY);
    mockRepo.listForUser.mockResolvedValue([{ action: 'showSolution', windowStart, used: 3 }]);

    const summary = await getSummary(1, false);

    expect(summary.showSolution).toMatchObject({ used: 0, remaining: 3, resetAt: null });
  });

  it('gives the tutor session its own 5-hour window', async () => {
    const windowStart = new Date(NOW.getTime() - 60_000);
    mockRepo.listForUser.mockResolvedValue([{ action: 'tutorMessage', windowStart, used: 27 }]);

    const summary = await getSummary(1, false);

    expect(USAGE_WINDOWS_MS.tutorMessage).toBe(5 * 60 * 60 * 1000);
    expect(summary.tutorMessage).toMatchObject({
      used: 27,
      limit: 30,
      remaining: 3,
      resetAt: new Date(windowStart.getTime() + USAGE_WINDOWS_MS.tutorMessage).toISOString(),
    });
  });

  it('is unlimited for admins, without reading the table', async () => {
    const summary = await getSummary(9, true);
    expect(summary.tutorMessage).toMatchObject({
      unlimited: true,
      remaining: Infinity,
      resetAt: null,
    });
    expect(mockRepo.listForUser).not.toHaveBeenCalled();
  });
});

describe('hold', () => {
  it('takes the units in one step and remembers their window', async () => {
    mockRepo.take.mockResolvedValue({ windowStart: NOW, used: 1, taken: 1 });

    const held = await hold(2, 'showSolution', false);

    expect(mockRepo.take).toHaveBeenCalledWith(
      2,
      'showSolution',
      1,
      USAGE_LIMITS.showSolution,
      DAY,
      NOW,
    );
    expect(held).toEqual({ userId: 2, action: 'showSolution', windowStart: NOW, units: 1 });
  });

  it('keeps however many were left when fewer than asked', async () => {
    mockRepo.take.mockResolvedValue({ windowStart: NOW, used: 30, taken: 1 });

    const held = await hold(2, 'tutorMessage', false, 2);

    expect(mockRepo.take).toHaveBeenCalledWith(
      2,
      'tutorMessage',
      2,
      30,
      USAGE_WINDOWS_MS.tutorMessage,
      NOW,
    );
    expect(held?.units).toBe(1);
  });

  it('throws 429 with the refill time when none are left', async () => {
    const windowStart = new Date(NOW.getTime() - 60_000);
    mockRepo.take.mockResolvedValue({ windowStart, used: 3, taken: 0 });

    const err = await hold(2, 'showSolution', false).catch((e: unknown) => e);

    expect(err).toBeInstanceOf(AppError);
    expect((err as AppError).statusCode).toBe(429);
    expect((err as AppError).message).toBe(
      `Limit reached. It refills at ${new Date(windowStart.getTime() + DAY).toISOString()}`,
    );
  });

  it('holds nothing for admins', async () => {
    expect(await hold(9, 'tutorMessage', true)).toBeNull();
    expect(mockRepo.take).not.toHaveBeenCalled();
  });
});

describe('release', () => {
  const held = { userId: 2, action: 'tutorMessage' as const, windowStart: NOW, units: 2 };

  it('gives units back to the window they came from', async () => {
    await release(held, 1);
    expect(mockRepo.giveBack).toHaveBeenCalledWith(2, 'tutorMessage', NOW, 1);
  });

  it('never gives back more than was held', async () => {
    await release(held, 5);
    expect(mockRepo.giveBack).toHaveBeenCalledWith(2, 'tutorMessage', NOW, 2);
  });

  it('does nothing for nothing, or for an admin', async () => {
    await release(held, 0);
    await release(null, 2);
    expect(mockRepo.giveBack).not.toHaveBeenCalled();
  });
});

describe('consume', () => {
  it('spends one unit and returns the refreshed summary', async () => {
    mockRepo.take.mockResolvedValue({ windowStart: NOW, used: 1, taken: 1 });
    mockRepo.listForUser.mockResolvedValue([{ action: 'showSolution', windowStart: NOW, used: 1 }]);

    const summary = await consume(3, 'showSolution', false);

    expect(mockRepo.take).toHaveBeenCalledWith(3, 'showSolution', 1, 3, DAY, NOW);
    expect(summary.showSolution.used).toBe(1);
  });
});
