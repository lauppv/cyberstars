import { z } from 'zod';
import { MAX_HINT_LEVEL } from '@cyberstars/shared/hints';

export const hintSchema = z.object({
  code: z.string().max(50_000),
  level: z.number().int().min(1).max(MAX_HINT_LEVEL),
  lang: z.enum(['en', 'ro']).optional(),
});
