import { z } from 'zod';

export const solutionSchema = z.object({
  lang: z.enum(['en', 'ro']).optional(),
});
