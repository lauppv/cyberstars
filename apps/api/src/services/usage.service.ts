import { AppError } from '../middleware/errorHandler.js';
import * as usageRepo from '../repositories/usage.repository.js';
import {
  USAGE_ACTIONS,
  USAGE_LIMIT_ERROR,
  USAGE_LIMITS,
  USAGE_WINDOWS_MS,
  type UsageAction,
  type UsageState,
  type UsageSummary,
} from '@cyberstars/shared/usage';

// Per-user rolling windows for the capped features (Show Solution, the tutor,
// AI hints), kept in the database so a deploy or a crash hands nobody a fresh
// allowance. A window opens with the first use and its units refill all at once
// when it ends. Admins/founder are unlimited and never touch the table.

function stateOf(
  action: UsageAction,
  row: usageRepo.UsageRow | undefined,
  isAdmin: boolean,
  now: number,
): UsageState {
  const limit = USAGE_LIMITS[action];
  if (isAdmin) {
    return { used: 0, limit, remaining: Infinity, resetAt: null, unlimited: true };
  }
  const resetAt = row ? row.windowStart.getTime() + USAGE_WINDOWS_MS[action] : 0;
  const live = row && resetAt > now;
  const used = live ? row.used : 0;
  return {
    used,
    limit,
    remaining: Math.max(0, limit - used),
    resetAt: live ? new Date(resetAt).toISOString() : null,
    unlimited: false,
  };
}

export async function getSummary(userId: number, isAdmin: boolean): Promise<UsageSummary> {
  const rows = isAdmin ? [] : await usageRepo.listForUser(userId);
  const now = Date.now();
  const summary = {} as UsageSummary;
  for (const action of USAGE_ACTIONS) {
    summary[action] = stateOf(
      action,
      rows.find((row) => row.action === action),
      isAdmin,
      now,
    );
  }
  return summary;
}

// Units taken before the work they pay for, to settle once it is done.
export interface UsageHold {
  userId: number;
  action: UsageAction;
  windowStart: Date;
  units: number;
}

// Takes up to `want` units of the action in one atomic step, at least one:
// with fewer left than asked, the last ones are taken. Throws 429 with the
// refill time when none are left. Admins hold nothing (null).
export async function hold(
  userId: number,
  action: UsageAction,
  isAdmin: boolean,
  want = 1,
): Promise<UsageHold | null> {
  if (isAdmin) return null;
  const { windowStart, taken } = await usageRepo.take(
    userId,
    action,
    want,
    USAGE_LIMITS[action],
    USAGE_WINDOWS_MS[action],
    new Date(),
  );
  if (taken === 0) {
    const refillAt = new Date(windowStart.getTime() + USAGE_WINDOWS_MS[action]).toISOString();
    throw new AppError(429, `${USAGE_LIMIT_ERROR}. It refills at ${refillAt}`);
  }
  return { userId, action, windowStart, units: taken };
}

// Gives back up to the held units when the work cost less, or failed.
export async function release(held: UsageHold | null, units: number): Promise<void> {
  const back = Math.min(units, held?.units ?? 0);
  if (!held || back <= 0) return;
  await usageRepo.giveBack(held.userId, held.action, held.windowStart, back);
}

// Spends one unit of the action and returns the refreshed summary. Throws 429
// with the refill time when the limit is already reached.
export async function consume(
  userId: number,
  action: UsageAction,
  isAdmin: boolean,
): Promise<UsageSummary> {
  await hold(userId, action, isAdmin);
  return getSummary(userId, isAdmin);
}
