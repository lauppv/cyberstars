import { AppError } from '../middleware/errorHandler.js';

// Caps how many judge runs (Run Tests) share the server at once. Each run is
// capped at half a core, but a few slow load tests together would still take
// the whole droplet and slow the site for everyone, so runs past the cap wait
// their turn, first come first served, and give up with a 503 after a while.
const MAX_CONCURRENT = Number(process.env.JUDGE_MAX_CONCURRENT ?? 2);
const QUEUE_TIMEOUT_MS = Number(process.env.JUDGE_QUEUE_TIMEOUT_MS ?? 20_000);

let active = 0;
const waiting: (() => void)[] = [];

function release(): void {
  const next = waiting.shift();
  // Hand the slot straight to the next run, so `active` never drops below the
  // cap while someone is waiting.
  if (next) next();
  else active--;
}

// Resolves with a release function once a slot is free; call it exactly once
// when the run ends, however it ends.
export function acquireJudgeSlot(
  max = MAX_CONCURRENT,
  timeoutMs = QUEUE_TIMEOUT_MS,
): Promise<() => void> {
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
      reject(new AppError(503, 'The judge is busy right now, please try again in a moment'));
    }, timeoutMs);
    waiting.push(grant);
  });
}
