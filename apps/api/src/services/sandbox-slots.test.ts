import os from 'os';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { acquireSandboxSlot } from './sandbox-slots.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('acquireSandboxSlot', () => {
  it('lets sandboxes in up to the limit and the next one in when a slot frees', async () => {
    const first = await acquireSandboxSlot(2, 1000);
    const second = await acquireSandboxSlot(2, 1000);
    let third: (() => void) | null = null;
    const waiting = acquireSandboxSlot(2, 1000).then((release) => (third = release));
    await Promise.resolve();
    expect(third).toBeNull();

    first();
    await waiting;
    expect(third).toBeTypeOf('function');
    second();
    third!();
  });

  it('gives up with a 503 saying the server is busy when no slot frees in time', async () => {
    vi.useFakeTimers();
    const held = await acquireSandboxSlot(1, 1000);
    const waiting = acquireSandboxSlot(1, 1000);
    vi.advanceTimersByTime(1000);
    await expect(waiting).rejects.toMatchObject({
      statusCode: 503,
      message: 'The server is busy right now, please try again in a moment',
    });
    held();
  });

  it('allows four busy sandboxes per core by default', async () => {
    const releases = [];
    for (let i = 0; i < os.availableParallelism() * 4; i++) {
      releases.push(await acquireSandboxSlot());
    }
    vi.useFakeTimers();
    const over = acquireSandboxSlot();
    vi.advanceTimersByTime(10_000);
    await expect(over).rejects.toMatchObject({ statusCode: 503 });
    for (const release of releases) release();
  });
});
