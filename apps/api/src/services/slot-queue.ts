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
  // when the work ends, however it ends.
  function acquire(max: number, timeoutMs: number): Promise<() => void> {
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
    return new Promise((resolve, reject) => {
      const grant = () => {
        clearTimeout(timer);
        resolve(once);
      };
      const timer = setTimeout(() => {
        waiting.splice(waiting.indexOf(grant), 1);
        reject(busy());
      }, timeoutMs);
      waiting.push(grant);
    });
  }

  return { acquire, inUse: () => active };
}
