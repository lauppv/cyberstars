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

const sandboxes = slotQueue(
  () => new AppError(503, 'The server is busy right now, please try again in a moment'),
);

// Resolves with a release function once a slot is free; call it exactly once
// when the sandbox is done, however it ends. Aborting `signal` leaves the line.
export function acquireSandboxSlot(
  signal?: AbortSignal,
  max = MAX_BUSY,
  timeoutMs = QUEUE_TIMEOUT_MS,
): Promise<() => void> {
  return sandboxes.acquire(max, timeoutMs, signal);
}

// For the admin dashboard: how many slots are taken right now, out of how many
export function sandboxSlots(): { busySlots: number; maxBusySlots: number } {
  return { busySlots: sandboxes.inUse(), maxBusySlots: MAX_BUSY };
}
