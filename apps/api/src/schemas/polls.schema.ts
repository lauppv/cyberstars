import { z } from 'zod';
import { POLL_MAX_OPTIONS } from '@cyberstars/shared/polls';

// One or more of the poll's options; the service checks they are its own
export const pollVoteSchema = z.object({
  optionIds: z
    .array(z.number().int().positive())
    .min(1, 'Pick at least one option')
    .max(POLL_MAX_OPTIONS, 'A poll takes at most 10 options'),
});
