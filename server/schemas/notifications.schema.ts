import { z } from 'zod';

// Lenient query params (like the leaderboard): bad values fall back to defaults
// and take is clamped, so a hand-edited URL can't 400 the list.
export const notificationsQuerySchema = z.object({
  take: z.coerce
    .number()
    .int()
    .catch(20)
    .transform((n) => Math.min(50, Math.max(1, n))),
  before: z.coerce.number().int().positive().optional().catch(undefined),
});

export const markReadSchema = z.object({
  upToId: z.number().int().positive(),
});
