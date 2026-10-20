import os from 'os';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { acquireSandboxSlot } from './sandbox-slots.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('acquireSandboxSlot', () => {
  it('lets sandboxes in up to the limit and the next one in when a slot frees', async () => {
    const first = await acquireSandboxSlot({}, 2, 1000);
    const second = await acquireSandboxSlot({}, 2, 1000);
    let third: (() => void) | null = null;
    const waiting = acquireSandboxSlot({}, 2, 1000).then((release) => (third = release));
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
    const held = await acquireSandboxSlot({}, 1, 1000);
    const waiting = acquireSandboxSlot({}, 1, 1000);
    vi.advanceTimersByTime(1000);
    await expect(waiting).rejects.toMatchObject({
      statusCode: 503,
      message: 'The server is busy right now, please try again in a moment',
    });
    held();
  });

  it('says when a run joins the line, and only then', async () => {
    const onWait = vi.fn();
    const held = await acquireSandboxSlot({ onWait }, 1, 1000);
    expect(onWait).not.toHaveBeenCalled();
    const waiting = acquireSandboxSlot({ onWait }, 1, 1000);
    expect(onWait).toHaveBeenCalledTimes(1);
    held();
    (await waiting)();
  });

  it('takes a run out of the line when it leaves, so the next one moves up', async () => {
    const held = await acquireSandboxSlot({}, 1, 1000);
    const leaving = new AbortController();
    const gone = acquireSandboxSlot({ signal: leaving.signal }, 1, 1000);
    const next = acquireSandboxSlot({}, 1, 1000);
    leaving.abort(new Error('left'));
    await expect(gone).rejects.toThrow('left');

    held();
    (await next)();
    // An already-aborted signal doesn't even join the line
    const blocker = await acquireSandboxSlot({}, 1, 1000);
    await expect(acquireSandboxSlot({ signal: leaving.signal }, 1, 1000)).rejects.toThrow('left');
    blocker();
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
});

// SANDBOX_STOP_AFTER_MS is 20 s by default
describe('stopping a run to make room', () => {
  // A held slot whose run can be stopped; stop() frees it like a run would
  async function stoppable(max: number, stopsAt = 0) {
    let calls = 0;
    let release: () => void = () => {};
    const stop = vi.fn(() => {
      calls += 1;
      if (calls <= stopsAt) return false;
      release();
      return true;
    });
    release = await acquireSandboxSlot({ stop }, max, 60_000);
    return { stop, release: () => release() };
  }

  it('stops the run once it has held its slot 20 s, while someone waits, and hands the slot on', async () => {
    vi.useFakeTimers();
    const held = await stoppable(1);
    vi.advanceTimersByTime(5_000);
    const waiting = acquireSandboxSlot({}, 1, 60_000);

    vi.advanceTimersByTime(14_999);
    expect(held.stop).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(held.stop).toHaveBeenCalledTimes(1);
    (await waiting)();
  });

  it('stops the longest-held run first, and only as many as are waiting', async () => {
    vi.useFakeTimers();
    const older = await stoppable(2);
    vi.advanceTimersByTime(5_000);
    const newer = await stoppable(2);
    vi.advanceTimersByTime(25_000);

    const waiting = acquireSandboxSlot({}, 2, 60_000);
    expect(older.stop).toHaveBeenCalledTimes(1);
    expect(newer.stop).not.toHaveBeenCalled();
    (await waiting)();
    newer.release();
  });

  it('stops nobody while nobody waits, and never a run that cannot be stopped', async () => {
    vi.useFakeTimers();
    const fixed = await acquireSandboxSlot({}, 2, 60_000);
    const held = await stoppable(2);
    vi.advanceTimersByTime(60_000);
    expect(held.stop).not.toHaveBeenCalled();

    // Now someone waits: only the run that can be stopped goes
    const waiting = acquireSandboxSlot({}, 2, 60_000);
    expect(held.stop).toHaveBeenCalledTimes(1);
    (await waiting)();
    fixed();
  });

  it('turns a run away as busy when only runs that cannot be stopped hold the slots', async () => {
    vi.useFakeTimers();
    const fixed = await acquireSandboxSlot({}, 1, 60_000);
    const waiting = acquireSandboxSlot({}, 1, 30_000);
    vi.advanceTimersByTime(30_000);
    await expect(waiting).rejects.toMatchObject({ statusCode: 503 });
    fixed();
  });

  it("tries again a second later when the run can't be stopped yet", async () => {
    vi.useFakeTimers();
    const held = await stoppable(1, 1);
    vi.advanceTimersByTime(20_000);
    const waiting = acquireSandboxSlot({}, 1, 60_000);
    expect(held.stop).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1_000);
    expect(held.stop).toHaveBeenCalledTimes(2);
    (await waiting)();
  });

  it('lets the run be once the one waiting leaves the line', async () => {
    vi.useFakeTimers();
    const held = await stoppable(1);
    const leaving = new AbortController();
    const waiting = acquireSandboxSlot({ signal: leaving.signal }, 1, 60_000);
    vi.advanceTimersByTime(10_000);
    leaving.abort(new Error('left'));
    await expect(waiting).rejects.toThrow('left');

    vi.advanceTimersByTime(30_000);
    expect(held.stop).not.toHaveBeenCalled();
    held.release();
  });
});
