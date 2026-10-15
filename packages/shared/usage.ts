// Usage caps for the "assist" features, shared by client and server so the UI
// meter and the API enforcement can never disagree. Each action has its own
// rolling window, opened by the first use after the last one ended (not a fixed
// clock reset), so `resetAt` is windowStart + the action's window. Admins and
// the founder are unlimited.
export type UsageAction = 'showSolution' | 'tutorMessage';

export const USAGE_ACTIONS: readonly UsageAction[] = ['showSolution', 'tutorMessage'];

// showSolution: 3 solution reveals per 24 h. tutorMessage: a 5-hour tutor
// session of 30 units, shared by all of a student's conversations; a message
// costs 1, or 2 when its answer is long, so a session holds 15 to 30 messages.
export const USAGE_LIMITS: Record<UsageAction, number> = {
  showSolution: 3,
  tutorMessage: 30,
};

const HOUR_MS = 60 * 60 * 1000;

export const USAGE_WINDOWS_MS: Record<UsageAction, number> = {
  showSolution: 24 * HOUR_MS,
  tutorMessage: 5 * HOUR_MS,
};

// How a 429 for a spent allowance starts, so the UI can tell it apart from a
// per-minute rate limit.
export const USAGE_LIMIT_ERROR = 'Limit reached';

export interface UsageState {
  used: number;
  limit: number;
  remaining: number;
  // ISO timestamp when the current window resets, or null when nothing has been
  // used yet in a window (or the caller is unlimited).
  resetAt: string | null;
  unlimited: boolean;
}

export type UsageSummary = Record<UsageAction, UsageState>;

// A Show Solution reveal: the lesson's solution markdown plus the refreshed usage.
export interface SolutionReveal {
  solution: string;
  usage: UsageSummary;
}
