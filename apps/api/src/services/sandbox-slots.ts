import os from 'os';
import { AppError } from '../middleware/errorHandler.js';
import { slotQueue } from './slot-queue.js';

// Caps how many sandboxes are busy at once across everyone: editor runs, Run
// Tests (inside their own cap of two) and terminal commands. Each may take
// half a core and 128 MB, and nothing else stops a crowd of them from filling
// the droplet. Four per core by default: most runs are over in a moment or sit
// waiting for input, so the CPU is shared but not swamped.
const MAX_BUSY = Number(process.env.SANDBOX_MAX_BUSY ?? os.availableParallelism() * 4);
const QUEUE_TIMEOUT_MS = Number(process.env.SANDBOX_QUEUE_TIMEOUT_MS ?? 10_000);
// An editor run's 20 s limit starts over with every line of input, so a run
// fed input never gives its slot back. While someone waits, one that has held
// its slot this long is stopped to make room. A run without input ends within
// 20 s anyway, so the default only ever reaches runs kept alive with input.
const STOP_AFTER_MS = Number(process.env.SANDBOX_STOP_AFTER_MS ?? 20_000);

const sandboxes = slotQueue(
  () => new AppError(503, 'The server is busy right now, please try again in a moment'),
  STOP_AFTER_MS,
);

// Resolves with a release function once a slot is free; call it exactly once
// when the sandbox is done, however it ends. Aborting `signal` leaves the line,
// and `stop` lets the run be stopped to make room once it has held its slot
// too long (editor runs only).
export function acquireSandboxSlot(
  options: { signal?: AbortSignal; stop?: () => boolean } = {},
  max = MAX_BUSY,
  timeoutMs = QUEUE_TIMEOUT_MS,
): Promise<() => void> {
  return sandboxes.acquire(max, timeoutMs, options);
}

// For the admin dashboard: how many slots are taken right now, out of how many
export function sandboxSlots(): { busySlots: number; maxBusySlots: number } {
  return { busySlots: sandboxes.inUse(), maxBusySlots: MAX_BUSY };
}
