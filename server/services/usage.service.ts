import { AppError } from '../middleware/errorHandler.js';
import {
  USAGE_ACTIONS,
  USAGE_LIMITS,
  USAGE_WINDOW_MS,
  type UsageAction,
  type UsageState,
  type UsageSummary,
} from '../../shared/usage.js';

// Per-user rolling 24h counters for the assist features (Show Solution, AI
// hints). In-memory and best-effort — like the guest run budget and the
// per-minute rate limiters, this is anti-abuse, not an audited quota, so a
// server restart resetting it is acceptable. Keyed by `${userId}:${action}`.
interface Window {
  windowStart: number; // epoch ms of the first consume in the current window
  count: number;
}

const windows = new Map<string, Window>();

function keyOf(userId: number, action: UsageAction): string {
  return `${userId}:${action}`;
}

// Return the live window for a user+action, clearing it first if the previous
// window has elapsed. Returns null when there is no active window.
function activeWindow(userId: number, action: UsageAction, now: number): Window | null {
  const win = windows.get(keyOf(userId, action));
  if (!win) return null;
  if (now - win.windowStart >= USAGE_WINDOW_MS) {
    windows.delete(keyOf(userId, action));
    return null;
  }
  return win;
}

function stateFrom(action: UsageAction, win: Window | null, isAdmin: boolean): UsageState {
  const limit = USAGE_LIMITS[action];
  if (isAdmin) {
    return { used: 0, limit, remaining: Infinity, resetAt: null, unlimited: true };
  }
  const used = win?.count ?? 0;
  return {
    used,
    limit,
    remaining: Math.max(0, limit - used),
    resetAt: win ? new Date(win.windowStart + USAGE_WINDOW_MS).toISOString() : null,
    unlimited: false,
  };
}

export function getState(userId: number, action: UsageAction, isAdmin: boolean): UsageState {
  return stateFrom(action, activeWindow(userId, action, Date.now()), isAdmin);
}

export function getSummary(userId: number, isAdmin: boolean): UsageSummary {
  const summary = {} as UsageSummary;
  for (const action of USAGE_ACTIONS) {
    summary[action] = getState(userId, action, isAdmin);
  }
  return summary;
}

// Consume one unit of the given action. Throws 429 with the reset time when the
// limit is already reached. Admins never consume and are always allowed.
export function consume(userId: number, action: UsageAction, isAdmin: boolean): UsageSummary {
  if (!isAdmin) {
    const now = Date.now();
    let win = activeWindow(userId, action, now);
    if (win && win.count >= USAGE_LIMITS[action]) {
      const resetAt = new Date(win.windowStart + USAGE_WINDOW_MS).toISOString();
      throw new AppError(429, `Daily limit reached. Resets at ${resetAt}`);
    }
    if (!win) {
      win = { windowStart: now, count: 0 };
      windows.set(keyOf(userId, action), win);
    }
    win.count += 1;
  }
  return getSummary(userId, isAdmin);
}

// Test-only: wipe all counters so suites don't leak state into each other.
export function _resetAll(): void {
  windows.clear();
}
