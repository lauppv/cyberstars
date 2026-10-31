import { AppError } from '@cyberstars-framework/server-kit/errors';
import { slotQueue, type SlotOptions } from '@cyberstars-framework/sandbox/slots';

// Caps how many judge runs (Run Tests) share the server at once. Each run is
// capped at half a core, but a few slow load tests together would still take
// the whole droplet and slow the site for everyone, so runs past the cap wait
// their turn, first come first served, and give up with a 503 after a while.
const MAX_CONCURRENT = Number(process.env.JUDGE_MAX_CONCURRENT ?? 2);
const QUEUE_TIMEOUT_MS = Number(process.env.JUDGE_QUEUE_TIMEOUT_MS ?? 20_000);

const judge = slotQueue(
  () => new AppError(503, 'The judge is busy right now, please try again in a moment'),
);

// Resolves with a release function once a slot is free; call it exactly once
// when the run ends, however it ends. `onWait` hears when it joins the line.
export function acquireJudgeSlot(
  { onWait }: Pick<SlotOptions, 'onWait'> = {},
  max = MAX_CONCURRENT,
  timeoutMs = QUEUE_TIMEOUT_MS,
): Promise<() => void> {
  return judge.acquire(max, timeoutMs, { onWait });
}
