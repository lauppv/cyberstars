import type { AppError } from '../middleware/errorHandler.js';

interface Holder {
  since: number;
  // Stops the work holding the slot, which then releases it. Says false when
  // the work can't be stopped just now (still starting, say)
  stop?: () => boolean;
}

interface Waiter {
  holder: Holder;
  grant: () => void;
}

// A cap on how many of something share the server at once. Past the cap they
// wait their turn, first come first served, and give up with `busy()` after a
// while. The judge and the sandboxes each keep one. With `stopAfterMs`, while
// anyone waits, a holder that can be stopped and has held its slot that long
// is stopped to make room, the longest-held first.
export function slotQueue(busy: () => AppError, stopAfterMs = Infinity) {
  const holders = new Set<Holder>();
  const waiting: Waiter[] = [];
  let roomTimer: ReturnType<typeof setTimeout> | null = null;

  function take(holder: Holder): void {
    holder.since = Date.now();
    holders.add(holder);
  }

  function release(holder: Holder): void {
    holders.delete(holder);
    // Hand the slot straight to the next one, so nobody slips in ahead of
    // the line.
    const next = waiting.shift();
    if (next) {
      take(next.holder);
      next.grant();
    }
    makeRoom();
  }

  // Runs whenever the line or the holders change, and again when the next
  // holder comes of age.
  function makeRoom(): void {
    if (roomTimer) clearTimeout(roomTimer);
    roomTimer = null;
    if (!waiting.length || stopAfterMs === Infinity) return;
    const now = Date.now();
    const stoppable = [...holders].filter((h) => h.stop).sort((a, b) => a.since - b.since);
    let wait = Infinity;
    for (const holder of stoppable) {
      const age = now - holder.since;
      if (age < stopAfterMs) {
        wait = Math.min(wait, stopAfterMs - age);
        break;
      }
      const stop = holder.stop!;
      // Its release hands the slot on and looks again
      if (stop()) {
        holder.stop = undefined;
        return;
      }
      wait = 1000;
    }
    if (wait !== Infinity) {
      roomTimer = setTimeout(makeRoom, wait);
      roomTimer.unref?.();
    }
  }

  // Resolves with a release function once a slot is free; call it exactly once
  // when the work ends, however it ends. Aborting `signal` takes a waiting one
  // out of the line, so whoever is behind it moves up. `stop` makes the work
  // one that can be stopped to make room.
  function acquire(
    max: number,
    timeoutMs: number,
    { signal, stop }: { signal?: AbortSignal; stop?: () => boolean } = {},
  ): Promise<() => void> {
    const holder: Holder = { since: 0, stop };
    let released = false;
    const once = () => {
      if (released) return;
      released = true;
      release(holder);
    };
    if (holders.size < max) {
      take(holder);
      return Promise.resolve(once);
    }
    if (signal?.aborted) return Promise.reject(signal.reason);
    return new Promise((resolve, reject) => {
      const waiter: Waiter = {
        holder,
        grant: () => {
          clearTimeout(timer);
          signal?.removeEventListener('abort', onAbort);
          resolve(once);
        },
      };
      const leave = (reason: unknown) => {
        clearTimeout(timer);
        signal?.removeEventListener('abort', onAbort);
        waiting.splice(waiting.indexOf(waiter), 1);
        makeRoom();
        reject(reason);
      };
      const onAbort = () => leave(signal!.reason);
      const timer = setTimeout(() => leave(busy()), timeoutMs);
      signal?.addEventListener('abort', onAbort);
      waiting.push(waiter);
      makeRoom();
    });
  }

  return { acquire, inUse: () => holders.size };
}
