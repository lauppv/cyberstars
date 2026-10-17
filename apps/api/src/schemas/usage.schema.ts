import { z } from 'zod';
import { CODE_LANGUAGES } from '@cyberstars/shared/constants';

export const solutionSchema = z.object({
  lang: z.enum(['en', 'ro']).optional(),
  // The language picked on a multi-language course; other courses ignore it.
  language: z.enum(CODE_LANGUAGES).optional(),
});
