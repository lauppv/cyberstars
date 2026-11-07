import { z } from 'zod';

// A lesson's sandbox, or a Linux project's (`project` is its slug)
export const createSessionSchema = z.union([
  z.object({
    courseKey: z.string().min(1),
    lessonSlug: z.string().min(1),
    lang: z.enum(['en', 'ro']).optional(),
  }),
  z.object({ project: z.string().min(1).max(100) }),
]);

export const execSchema = z.object({
  sessionId: z.string().uuid(),
  command: z.string().min(1).max(2000),
});

export const destroySchema = z.object({
  sessionId: z.string().uuid(),
});

export const checkSchema = z.object({
  sessionId: z.string().uuid(),
  courseKey: z.string().min(1),
  lessonSlug: z.string().min(1),
  lang: z.enum(['en', 'ro']).optional(),
});
