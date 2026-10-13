import { z } from 'zod';

export const runTestsSchema = z.object({
  code: z.string().max(50_000),
  lang: z.enum(['en', 'ro']).optional(),
});
