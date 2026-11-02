import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import { USAGE_LIMIT_ERROR, type UsageRules, type UsageState, type UsageSummary } from './rules.js';

export interface FeatureGateOptions<Feature extends string, Role extends string> {
  // The app's feature rule, with its environment already applied. It must let
  // every role in wherever it lets a guest in: the gate lets everyone through
  // a feature open to guests without asking for the role
  canAccess: (feature: Feature, role: Role | undefined) => boolean;
  // The caller's role from the app's own records, never from the token;
  // undefined for a guest. Asked only when the answer depends on it
  role: (req: Request) => Promise<Role | undefined>;
}

// The server's side of the feature rule, for routes. A caller who may not use
// the feature gets 404, not 403, so the route's very existence stays hidden.
// It may run after a check that requires a signed-in user or one that only
// reads them, so the role may be a guest's
export function createFeatureGate<Feature extends string, Role extends string>(
  options: FeatureGateOptions<Feature, Role>,
) {
  const { canAccess, role } = options;
  return function requireFeatureAccess(feature: Feature) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // A feature open to a guest is open to everyone, so the role is read
        // only when the feature is closed to guests
        if (!canAccess(feature, undefined) && !canAccess(feature, await role(req))) {
          res.status(404).json({ error: 'Not found' });
          return;
        }
        next();
      } catch (err) {
        next(err);
      }
    };
  };
}

// One user's window for one action, as the app keeps it
export interface UsageWindow {
  action: string;
  windowStart: Date;
  used: number;
}

// The app's own usage table, which the package reaches only through these.
// The table stays the app's, like its users
export interface UsageStore<Action extends string> {
  // Every window the user has, live or ended
  list(userId: number): Promise<UsageWindow[]>;
  // Takes up to `want` units of the action, as many as are left under `limit`,
  // in one atomic step, so two requests can't both take the last one. A window
  // `windowMs` old or more has ended, and this use opens a new one at `now`.
  // Says when the window it took from opened and how many it took
  take(
    userId: number,
    action: Action,
    want: number,
    limit: number,
    windowMs: number,
    now: Date,
  ): Promise<{ windowStart: Date; taken: number }>;
  // Returns units to the window they were taken from; a window that has
  // opened again since keeps its own count
  giveBack(userId: number, action: Action, windowStart: Date, units: number): Promise<void>;
}

// Units taken before the work they pay for, to settle once it is done
export interface UsageHold<Action extends string> {
  userId: number;
  action: Action;
  windowStart: Date;
  units: number;
}

export interface UsageOptions<Action extends string> {
  rules: UsageRules<Action>;
  store: UsageStore<Action>;
}

// Per-user rolling windows for the app's limited actions, kept in the app's
// own table so a restart hands nobody a fresh allowance. Admins are unlimited
// and never touch the table: the app tells, since the package knows no roles
export function createUsage<Action extends string>(options: UsageOptions<Action>) {
  const { rules, store } = options;
  const actions = Object.keys(rules) as Action[];

  function stateOf(
    action: Action,
    window: UsageWindow | undefined,
    isAdmin: boolean,
    now: number,
  ): UsageState {
    const { limit, windowMs } = rules[action];
    if (isAdmin) {
      return { used: 0, limit, remaining: Infinity, resetAt: null, unlimited: true };
    }
    const resetAt = window ? window.windowStart.getTime() + windowMs : 0;
    const live = window && resetAt > now;
    const used = live ? window.used : 0;
    return {
      used,
      limit,
      remaining: Math.max(0, limit - used),
      resetAt: live ? new Date(resetAt).toISOString() : null,
      unlimited: false,
    };
  }

  // What the user has used of every action, and when each window refills
  async function getSummary(userId: number, isAdmin: boolean): Promise<UsageSummary<Action>> {
    const windows = isAdmin ? [] : await store.list(userId);
    const now = Date.now();
    const summary = {} as UsageSummary<Action>;
    for (const action of actions) {
      summary[action] = stateOf(
        action,
        windows.find((window) => window.action === action),
        isAdmin,
        now,
      );
    }
    return summary;
  }

  // Takes up to `want` units of the action in one atomic step, at least one:
  // with fewer left than asked, the last ones are taken. Throws 429 with the
  // refill time when none are left. Admins hold nothing (null)
  async function hold(
    userId: number,
    action: Action,
    isAdmin: boolean,
    want = 1,
  ): Promise<UsageHold<Action> | null> {
    if (isAdmin) return null;
    const { limit, windowMs } = rules[action];
    const { windowStart, taken } = await store.take(
      userId,
      action,
      want,
      limit,
      windowMs,
      new Date(),
    );
    if (taken === 0) {
      const refillAt = new Date(windowStart.getTime() + windowMs).toISOString();
      throw new AppError(429, `${USAGE_LIMIT_ERROR}. It refills at ${refillAt}`);
    }
    return { userId, action, windowStart, units: taken };
  }

  // Gives back up to the held units when the work cost less, or failed
  async function release(held: UsageHold<Action> | null, units: number): Promise<void> {
    const back = Math.min(units, held?.units ?? 0);
    if (!held || back <= 0) return;
    await store.giveBack(held.userId, held.action, held.windowStart, back);
  }

  // Spends one unit of the action and returns the refreshed summary. Throws
  // 429 with the refill time when the limit is already reached
  async function consume(
    userId: number,
    action: Action,
    isAdmin: boolean,
  ): Promise<UsageSummary<Action>> {
    await hold(userId, action, isAdmin);
    return getSummary(userId, isAdmin);
  }

  return { getSummary, hold, release, consume };
}
