// Daily usage caps for the two "assist" features, shared by client and server so
// the UI meter and the API enforcement can never disagree. The window is a
// rolling 24h from the first consumed action in the window (not a fixed clock
// reset), so `resetAt` is windowStart + 24h. Admins/founder are unlimited.
export type UsageAction = 'showSolution' | 'getHint';

export const USAGE_ACTIONS: readonly UsageAction[] = ['showSolution', 'getHint'];

// showSolution: 3 solution reveals/day. getHint: 10 AI hint calls/day (each of
// the 3 progressive levels is one Gemini call and counts as one).
export const USAGE_LIMITS: Record<UsageAction, number> = {
  showSolution: 3,
  getHint: 10,
};

export const USAGE_WINDOW_MS = 24 * 60 * 60 * 1000;

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
