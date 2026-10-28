import { z } from 'zod';
import { ANNOUNCEMENT_MAX_LENGTH } from '@cyberstars/shared/notifications';

export const announcementSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Announcement text is required')
    .max(ANNOUNCEMENT_MAX_LENGTH, 'Announcement is too long (max 2000 chars)'),
});
