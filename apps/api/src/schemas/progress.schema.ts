import { z } from 'zod';
import { CODE_LANGUAGES } from '@cyberstars/shared/constants';
import { WEB_MAX_LENGTH } from '@cyberstars/shared/webFiles';

export const saveCodeSchema = z.object({
  // The biggest a course allows; codeFitsCourse holds each course to its own
  code: z.string().max(WEB_MAX_LENGTH),
  // The code's language on a multi-language course; other courses ignore it.
  language: z.enum(CODE_LANGUAGES).optional(),
});
