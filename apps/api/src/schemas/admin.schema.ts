import { z } from 'zod';
import { ANNOUNCEMENT_MAX_LENGTH } from '@cyberstars/shared/notifications';
import {
  POLL_MAX_OPTIONS,
  POLL_MIN_OPTIONS,
  POLL_OPTION_MAX_LENGTH,
  POLL_QUESTION_MAX_LENGTH,
} from '@cyberstars/shared/polls';

export const announcementSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Announcement text is required')
    .max(ANNOUNCEMENT_MAX_LENGTH, 'Announcement is too long (max 2000 chars)'),
});

// A question and 2 to 10 options, each written once, and maybe an Other to write in
export const pollSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, 'Poll question is required')
    .max(POLL_QUESTION_MAX_LENGTH, 'Poll question is too long (max 300 chars)'),
  options: z
    .array(
      z
        .string()
        .trim()
        .min(1, 'A poll option cannot be empty')
        .max(POLL_OPTION_MAX_LENGTH, 'A poll option is too long (max 200 chars)'),
    )
    .min(POLL_MIN_OPTIONS, 'A poll needs at least 2 options')
    .max(POLL_MAX_OPTIONS, 'A poll takes at most 10 options')
    .refine((list) => new Set(list).size === list.length, {
      message: 'Each poll option only once',
    }),
  other: z.boolean().optional(),
});
