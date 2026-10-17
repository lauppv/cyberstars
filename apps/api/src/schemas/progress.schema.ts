import { z } from 'zod';
import { CODE_LANGUAGES } from '@cyberstars/shared/constants';

export const saveCodeSchema = z.object({
  code: z.string().max(50_000),
  // The code's language on a multi-language course; other courses ignore it.
  language: z.enum(CODE_LANGUAGES).optional(),
});
