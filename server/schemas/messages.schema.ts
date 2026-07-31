import { z } from 'zod';

export const openConversationSchema = z.object({
  recipientId: z.number().int().positive(),
});

// Also reused for edits — an edit swaps the content under the same constraints.
export const sendMessageSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

export const markReadSchema = z.object({
  upToMessageId: z.number().int().positive(),
});

export const toggleReactionSchema = z.object({
  emoji: z.string().min(1).max(10),
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
