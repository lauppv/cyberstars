import { z } from 'zod';
import { TUTOR_MESSAGE_MAX_LENGTH } from '@cyberstars/shared/tutor';

export const tutorChatSchema = z.object({
  message: z.string().trim().min(1).max(TUTOR_MESSAGE_MAX_LENGTH),
  // The in-app path the student is on, without the /ro prefix: it goes into the
  // prompt, so nothing but a short path gets through.
  page: z
    .string()
    .max(200)
    .regex(/^\/[\w\-/]*$/),
  lang: z.enum(['en', 'ro']).optional(),
});
