import type { AppError } from '../middleware/errorHandler.js';

// A cap on how many of something share the server at once. Past the cap they
// wait their turn, first come first served, and give up with `busy()` after a
// while. The judge and the sandboxes each keep one
export function slotQueue(busy: () => AppError) {
  let active = 0;
  const waiting: (() => void)[] = [];

  function release(): void {
    const next = waiting.shift();
    // Hand the slot straight to the next one, so `active` never drops below
    // the cap while someone is waiting.
    if (next) next();
    else active--;
  }

  // Resolves with a release function once a slot is free; call it exactly once
  // when the work ends, however it ends. Aborting `signal` takes a waiting one
  // out of the line, so whoever is behind it moves up.
  function acquire(max: number, timeoutMs: number, signal?: AbortSignal): Promise<() => void> {
    let released = false;
    const once = () => {
      if (released) return;
      released = true;
      release();
    };
    if (active < max) {
      active++;
      return Promise.resolve(once);
    }
    if (signal?.aborted) return Promise.reject(signal.reason);
    return new Promise((resolve, reject) => {
      const leave = (reason: unknown) => {
        clearTimeout(timer);
        signal?.removeEventListener('abort', onAbort);
        waiting.splice(waiting.indexOf(grant), 1);
        reject(reason);
      };
      const onAbort = () => leave(signal!.reason);
      const grant = () => {
        clearTimeout(timer);
        signal?.removeEventListener('abort', onAbort);
        resolve(once);
      };
      const timer = setTimeout(() => leave(busy()), timeoutMs);
      signal?.addEventListener('abort', onAbort);
      waiting.push(grant);
    });
  }

  return { acquire, inUse: () => active };
}
