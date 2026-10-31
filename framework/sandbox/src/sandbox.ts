import { AppError } from '@cyberstars-framework/server-kit/errors';
import { createPool, type PoolOptions } from './pool.js';
import { liveRun } from './live-run.js';
import { slotQueue, type SlotOptions } from './slots.js';

export type { HeldContainer } from './pool.js';
export type { RunSocket } from './live-run.js';

export interface SandboxOptions extends PoolOptions {
  // How many sandboxes may be busy at once, across everything that takes a
  // slot: live runs, and whatever else of the app's runs in one
  maxBusy: number;
  // How long a run waits in line for a slot before it gives up as busy
  queueTimeoutMs: number;
  // While anyone waits, a live run that has held its slot this long is
  // stopped to make room. Its time limit starts over with every line of
  // input, so only runs kept alive with input get that far
  stopAfterMs: number;
}

// Runs untrusted code in Docker: a container per owner on the language they
// last ran (pool.ts), a cap on how many sandboxes are busy at once with a
// line past it (slots.ts), and the live run that streams a program over a
// WebSocket (live-run.ts). An app creates one with its languages, its label
// and its limits.
export function createSandbox(options: SandboxOptions) {
  const pool = createPool(options);
  const busy = slotQueue(
    () => new AppError(503, 'The server is busy right now, please try again in a moment'),
    options.stopAfterMs,
  );

  // Resolves with a release function once a slot is free; call it exactly
  // once when the sandbox is done, however it ends. Aborting `signal` leaves
  // the line, `stop` lets the work be stopped to make room once it has held
  // its slot too long, and `onWait` hears when it joins the line.
  function acquireSlot(slot: SlotOptions = {}): Promise<() => void> {
    return busy.acquire(options.maxBusy, options.queueTimeoutMs, slot);
  }

  // How many slots are taken right now, out of how many
  function slots(): { busySlots: number; maxBusySlots: number } {
    return { busySlots: busy.inUse(), maxBusySlots: options.maxBusy };
  }

  return { ...pool, acquireSlot, slots, run: liveRun({ pool, acquireSlot }) };
}

export type Sandbox = ReturnType<typeof createSandbox>;
