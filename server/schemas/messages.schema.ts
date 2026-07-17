import { z } from 'zod';

export const openConversationSchema = z.object({
  recipientId: z.number().int().positive(),
});

export const sendMessageSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

export const markReadSchema = z.object({
  upToMessageId: z.number().int().positive(),
});

// Lenient list query (like notifications/leaderboard): bad values fall back to
// defaults so a hand-edited URL can't 400 the history.
export const historyQuerySchema = z.object({
  take: z.coerce
    .number()
    .int()
    .catch(30)
    .transform((n) => Math.min(50, Math.max(1, n))),
  before: z.coerce.number().int().positive().optional().catch(undefined),
});
