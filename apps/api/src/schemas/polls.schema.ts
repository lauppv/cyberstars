import { z } from 'zod';
import { POLL_ANSWER_MAX_LENGTH, POLL_MAX_OPTIONS } from '@cyberstars/shared/polls';

// One or more of the poll's options, and what was written under Other when it's
// one of them; the service checks the options are its own
export const pollVoteSchema = z.object({
  optionIds: z
    .array(z.number().int().positive())
    .min(1, 'Pick at least one option')
    .max(POLL_MAX_OPTIONS + 1, 'A poll takes at most 10 options and Other'),
  answer: z
    .string()
    .trim()
    .min(1, 'Your answer cannot be empty')
    .max(POLL_ANSWER_MAX_LENGTH, 'Your answer is too long (max 500 chars)')
    .optional(),
});
