import { z } from 'zod';

export const createSessionSchema = z.object({
  courseKey: z.string().min(1),
  lessonSlug: z.string().min(1),
});

export const execSchema = z.object({
  sessionId: z.string().uuid(),
  command: z.string().min(1).max(2000),
});

export const destroySchema = z.object({
  sessionId: z.string().uuid(),
});
