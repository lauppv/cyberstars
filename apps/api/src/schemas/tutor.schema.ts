import { z } from 'zod';
import { lessons } from '@cyberstars/content/curriculum';
import { TUTOR_MESSAGE_MAX_LENGTH, TUTOR_RUN_OUTPUT_MAX_LENGTH } from '@cyberstars/shared/tutor';

// A lesson or algorithm challenge the curriculum lists, so a conversation can
// only be about one that exists.
export const tutorLessonSchema = z
  .object({ courseKey: z.string().max(50), lessonSlug: z.string().max(100) })
  .refine(
    (ref) => lessons.some((l) => l.courseKey === ref.courseKey && l.slug === ref.lessonSlug),
    {
      message: 'No such lesson',
    },
  );

// The student's work on the lesson, sent with each message of its conversation.
// The code has the judge's own cap.
const tutorWorkSchema = z.object({
  code: z.string().max(50_000),
  runOutput: z.string().max(TUTOR_RUN_OUTPUT_MAX_LENGTH),
  submissionId: z.number().int().positive().max(2_147_483_647).optional(),
});

export const tutorChatSchema = z
  .object({
    message: z.string().trim().min(1).max(TUTOR_MESSAGE_MAX_LENGTH),
    // The in-app path the student is on, without the /ro prefix: it goes into the
    // prompt, so nothing but a short path gets through.
    page: z
      .string()
      .max(200)
      .regex(/^\/[\w\-/]*$/),
    lang: z.enum(['en', 'ro']).optional(),
    // The conversation this message belongs to; without it, the general one.
    lesson: tutorLessonSchema.optional(),
    work: tutorWorkSchema.optional(),
  })
  // Work belongs to a lesson: the general conversation has none.
  .refine((body) => !body.work || body.lesson, { message: 'Work needs a lesson' });

// Lenient, like the other history lists: a bad cursor reads the newest page.
export const tutorPageQuerySchema = z.object({
  before: z.coerce.number().int().positive().max(2_147_483_647).optional().catch(undefined),
});
