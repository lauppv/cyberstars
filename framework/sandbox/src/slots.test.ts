import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { slotQueue, type SlotOptions } from './slots.js';

// A fresh queue per test whose holders, once they can be, are stopped to make
// room after 20 s
let queue: ReturnType<typeof slotQueue>;
beforeEach(() => {
  queue = slotQueue(() => new Error('busy'), 20_000);
});

function acquire(options: SlotOptions = {}, max = 1, timeoutMs = 1000) {
  return queue.acquire(max, timeoutMs, options);
}

afterEach(() => {
  vi.useRealTimers();
});

describe('slotQueue', () => {
  it('lets work in up to the limit and the next one in when a slot frees', async () => {
    const first = await acquire({}, 2);
    const second = await acquire({}, 2);
    let third: (() => void) | null = null;
    const waiting = acquire({}, 2).then((release) => (third = release));
    await Promise.resolve();
    expect(third).toBeNull();
    expect(queue.inUse()).toBe(2);

    first();
    await waiting;
    expect(third).toBeTypeOf('function');
    second();
    third!();
    expect(queue.inUse()).toBe(0);
  });

  it('gives up with its busy error when no slot frees in time', async () => {
    vi.useFakeTimers();
    const held = await acquire();
    const waiting = acquire();
    vi.advanceTimersByTime(1000);
    await expect(waiting).rejects.toThrow('busy');
    held();
  });

  it('says when work joins the line, and only then', async () => {
    const onWait = vi.fn();
    const held = await acquire({ onWait });
    expect(onWait).not.toHaveBeenCalled();
    const waiting = acquire({ onWait });
    expect(onWait).toHaveBeenCalledTimes(1);
    held();
    (await waiting)();
  });

  it('takes work out of the line when it leaves, so the next one moves up', async () => {
    const held = await acquire();
    const leaving = new AbortController();
    const gone = acquire({ signal: leaving.signal });
    const next = acquire();
    leaving.abort(new Error('left'));
    await expect(gone).rejects.toThrow('left');

    held();
    (await next)();
    // An already-aborted signal doesn't even join the line
    const blocker = await acquire();
    await expect(acquire({ signal: leaving.signal })).rejects.toThrow('left');
    blocker();
  });
});

describe('stopping work to make room', () => {
  // A held slot whose work can be stopped; stop() frees it like the work would
  async function stoppable(max: number, stopsAt = 0) {
    let calls = 0;
    let release: () => void = () => {};
    const stop = vi.fn(() => {
      calls += 1;
      if (calls <= stopsAt) return false;
      release();
      return true;
    });
    release = await acquire({ stop }, max, 60_000);
    return { stop, release: () => release() };
  }

  it('stops the work once it has held its slot 20 s, while someone waits, and hands the slot on', async () => {
    vi.useFakeTimers();
    const held = await stoppable(1);
    vi.advanceTimersByTime(5_000);
    const waiting = acquire({}, 1, 60_000);

    vi.advanceTimersByTime(14_999);
    expect(held.stop).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(held.stop).toHaveBeenCalledTimes(1);
    (await waiting)();
  });

  it('stops the longest-held work first, and only as many as are waiting', async () => {
    vi.useFakeTimers();
    const older = await stoppable(2);
    vi.advanceTimersByTime(5_000);
    const newer = await stoppable(2);
    vi.advanceTimersByTime(25_000);

    const waiting = acquire({}, 2, 60_000);
    expect(older.stop).toHaveBeenCalledTimes(1);
    expect(newer.stop).not.toHaveBeenCalled();
    (await waiting)();
    newer.release();
  });

  it('stops nobody while nobody waits, and never work that cannot be stopped', async () => {
    vi.useFakeTimers();
    const fixed = await acquire({}, 2, 60_000);
    const held = await stoppable(2);
    vi.advanceTimersByTime(60_000);
    expect(held.stop).not.toHaveBeenCalled();

    // Now someone waits: only the work that can be stopped goes
    const waiting = acquire({}, 2, 60_000);
    expect(held.stop).toHaveBeenCalledTimes(1);
    (await waiting)();
    fixed();
  });

  it('turns work away as busy when only work that cannot be stopped holds the slots', async () => {
    vi.useFakeTimers();
    const fixed = await acquire({}, 1, 60_000);
    const waiting = acquire({}, 1, 30_000);
    vi.advanceTimersByTime(30_000);
    await expect(waiting).rejects.toThrow('busy');
    fixed();
  });

  it("tries again a second later when the work can't be stopped yet", async () => {
    vi.useFakeTimers();
    const held = await stoppable(1, 1);
    vi.advanceTimersByTime(20_000);
    const waiting = acquire({}, 1, 60_000);
    expect(held.stop).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1_000);
    expect(held.stop).toHaveBeenCalledTimes(2);
    (await waiting)();
  });

  it('lets the work be once the one waiting leaves the line', async () => {
    vi.useFakeTimers();
    const held = await stoppable(1);
    const leaving = new AbortController();
    const waiting = acquire({ signal: leaving.signal }, 1, 60_000);
    vi.advanceTimersByTime(10_000);
    leaving.abort(new Error('left'));
    await expect(waiting).rejects.toThrow('left');

    vi.advanceTimersByTime(30_000);
    expect(held.stop).not.toHaveBeenCalled();
    held.release();
  });

  it('stops nobody without a stopAfterMs', async () => {
    vi.useFakeTimers();
    queue = slotQueue(() => new Error('busy'));
    const held = await stoppable(1);
    const waiting = acquire({}, 1, 60_000);
    vi.advanceTimersByTime(59_999);
    expect(held.stop).not.toHaveBeenCalled();
    held.release();
    (await waiting)();
  });
});
