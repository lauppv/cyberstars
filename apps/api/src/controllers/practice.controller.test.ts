import { describe, it, expect, vi, afterEach } from 'vitest';
import type { Request, Response } from 'express';
import { held } from './practice.controller.js';

const req = (wait: unknown) => ({ query: { wait } }) as unknown as Request;
const res = {} as Response;

afterEach(() => {
  vi.useRealTimers();
});

describe('held', () => {
  it('holds a read at most PRACTICE_MAX_WAIT_S seconds', async () => {
    vi.useFakeTimers();
    const next = vi.fn();
    const done = held(req('9'), res, next);
    await vi.advanceTimersByTimeAsync(2999);
    expect(next).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await done;
    expect(next).toHaveBeenCalledOnce();
  });

  it('goes on at once without a wait, or with one that is no number of seconds', async () => {
    for (const wait of [undefined, 'soon', '-2', '0']) {
      const next = vi.fn();
      await held(req(wait), res, next);
      expect(next).toHaveBeenCalledOnce();
    }
  });
});
