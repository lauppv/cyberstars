import { describe, it, expect, vi, afterEach } from 'vitest';
import { acquireJudgeSlot } from './judge-queue';

afterEach(() => {
  vi.useRealTimers();
});

describe('acquireJudgeSlot', () => {
  it('lets runs in up to the cap and the next one in when a slot frees, first come first served', async () => {
    const first = await acquireJudgeSlot(2, 1000);
    const second = await acquireJudgeSlot(2, 1000);
    const order: string[] = [];
    const third = acquireJudgeSlot(2, 1000).then((release) => {
      order.push('third');
      return release;
    });
    const fourth = acquireJudgeSlot(2, 1000).then((release) => {
      order.push('fourth');
      return release;
    });
    await Promise.resolve();
    expect(order).toEqual([]);

    first();
    // Releasing twice frees one slot, not two.
    first();
    expect(await third).toBeTypeOf('function');
    await Promise.resolve();
    expect(order).toEqual(['third']);

    second();
    (await fourth)();
    (await third)();
    expect(order).toEqual(['third', 'fourth']);

    // Every slot is free again: the cap lets two runs straight in.
    const a = await acquireJudgeSlot(2, 1000);
    const b = await acquireJudgeSlot(2, 1000);
    a();
    b();
  });

  it('gives up with a 503 when no slot frees in time, and leaves the queue as it was', async () => {
    vi.useFakeTimers();
    const held = await acquireJudgeSlot(1, 1000);
    const waiting = acquireJudgeSlot(1, 1000);
    vi.advanceTimersByTime(1000);
    await expect(waiting).rejects.toMatchObject({ statusCode: 503 });

    // The timed-out run is gone from the queue, so the next release frees the slot.
    held();
    const next = await acquireJudgeSlot(1, 1000);
    next();
  });
});
