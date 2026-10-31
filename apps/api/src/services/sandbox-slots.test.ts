import os from 'os';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { acquireSandboxSlot } from './sandbox-slots.js';

// How the line itself works is the sandbox package's (slots.test.ts); these
// are CyberStars' limits and words
afterEach(() => {
  vi.useRealTimers();
});

describe('acquireSandboxSlot', () => {
  it('gives up with a 503 saying the server is busy when no slot frees in time', async () => {
    vi.useFakeTimers();
    const held = await acquireSandboxSlot({}, 1, 1000);
    const waiting = acquireSandboxSlot({}, 1, 1000);
    vi.advanceTimersByTime(1000);
    await expect(waiting).rejects.toMatchObject({
      statusCode: 503,
      message: 'The server is busy right now, please try again in a moment',
    });
    held();
  });

  it('allows four busy sandboxes per core by default, the next one waiting up to 30 s', async () => {
    const releases = [];
    for (let i = 0; i < os.availableParallelism() * 4; i++) {
      releases.push(await acquireSandboxSlot());
    }
    vi.useFakeTimers();
    let settled = false;
    const over = acquireSandboxSlot().finally(() => (settled = true));
    vi.advanceTimersByTime(29_999);
    await Promise.resolve();
    expect(settled).toBe(false);
    vi.advanceTimersByTime(1);
    await expect(over).rejects.toMatchObject({ statusCode: 503 });
    for (const release of releases) release();
  });

  it('stops a run that can be stopped once it has held its slot 20 s, while someone waits', async () => {
    vi.useFakeTimers();
    let release: () => void = () => {};
    const stop = vi.fn(() => {
      release();
      return true;
    });
    release = await acquireSandboxSlot({ stop }, 1, 60_000);
    const waiting = acquireSandboxSlot({}, 1, 60_000);

    vi.advanceTimersByTime(19_999);
    expect(stop).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(stop).toHaveBeenCalledTimes(1);
    (await waiting)();
  });
});
