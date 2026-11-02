import { createUsage, type UsageHold as Hold } from '@cyberstars-framework/access/server';
import * as usageRepo from '../repositories/usage.repository.js';
import { USAGE_RULES, type UsageAction } from '@cyberstars/shared/usage';

// Per-user rolling windows for the capped features (Show Solution, the tutor),
// counted by the access package over CyberStars' usage_windows table, so a
// deploy or a crash hands nobody a fresh allowance. A window opens with the
// first use and its units refill all at once when it ends. Admins/founder are
// unlimited and never touch the table.
const usage = createUsage({
  rules: USAGE_RULES,
  store: { list: usageRepo.listForUser, take: usageRepo.take, giveBack: usageRepo.giveBack },
});

// Units taken before the work they pay for, to settle once it is done.
export type UsageHold = Hold<UsageAction>;

export const { getSummary, hold, release, consume } = usage;
