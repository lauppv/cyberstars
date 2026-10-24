import { z } from 'zod';
import { QUIZ_LENGTH, QUIZ_OPTIONS } from '@cyberstars/shared/laniakea';

export const startQuizSchema = z.object({
  lang: z.enum(['en', 'ro']).optional(),
});

// `index` is the question's place in the test, `choice` the option's place as
// shown.
export const answerQuizSchema = z.object({
  index: z
    .number()
    .int()
    .min(0)
    .max(QUIZ_LENGTH - 1),
  choice: z
    .number()
    .int()
    .min(0)
    .max(QUIZ_OPTIONS - 1),
});
