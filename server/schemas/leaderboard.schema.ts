import { z } from 'zod';

// Query params are lenient: bad/missing values fall back to defaults (.catch)
// and out-of-range values are clamped rather than rejected, so a hand-edited URL
// can't 400 the public leaderboard.
export const leaderboardQuerySchema = z.object({
  take: z.coerce
    .number()
    .int()
    .catch(50)
    .transform((n) => Math.min(100, Math.max(1, n))),
  skip: z.coerce
    .number()
    .int()
    .catch(0)
    .transform((n) => Math.max(0, n)),
});
