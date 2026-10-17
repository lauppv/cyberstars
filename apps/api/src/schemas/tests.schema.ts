import { z } from 'zod';
import { CODE_LANGUAGES } from '@cyberstars/shared/constants';

export const runTestsSchema = z.object({
  code: z.string().max(50_000),
  lang: z.enum(['en', 'ro']).optional(),
  // The language picked on a multi-language course; other courses ignore it.
  language: z.enum(CODE_LANGUAGES).optional(),
});
