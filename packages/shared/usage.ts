import type { UsageRules, UsageSummary as Summary } from '@cyberstars-framework/access/rules';

export { USAGE_LIMIT_ERROR, type UsageState } from '@cyberstars-framework/access/rules';

// Usage caps for the "assist" features, shared by client and server so the UI
// meter and the API enforcement can never disagree. Each action has its own
// rolling window, opened by the first use after the last one ended (not a fixed
// clock reset), so `resetAt` is windowStart + the action's window. Admins and
// the founder are unlimited. The counter itself is the access package's.
export type UsageAction = 'showSolution' | 'tutorMessage';

const HOUR_MS = 60 * 60 * 1000;

// showSolution: 3 solution reveals per 24 h. tutorMessage: a 5-hour tutor
// session of 30 units, shared by all of a student's conversations; a message
// costs 1, or 2 when its answer is long, so a session holds 15 to 30 messages.
export const USAGE_RULES: UsageRules<UsageAction> = {
  showSolution: { limit: 3, windowMs: 24 * HOUR_MS },
  tutorMessage: { limit: 30, windowMs: 5 * HOUR_MS },
};

export type UsageSummary = Summary<UsageAction>;

// A Show Solution reveal: the lesson's solution markdown plus the refreshed usage.
export interface SolutionReveal {
  solution: string;
  usage: UsageSummary;
}
