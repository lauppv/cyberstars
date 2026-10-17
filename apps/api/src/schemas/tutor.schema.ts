import { z } from 'zod';
import { lessons } from '@cyberstars/content/curriculum';
import { TUTOR_MESSAGE_MAX_LENGTH, TUTOR_RUN_OUTPUT_MAX_LENGTH } from '@cyberstars/shared/tutor';
import { CODE_LANGUAGES } from '@cyberstars/shared/constants';

// A lesson or algorithm challenge the curriculum lists, so a conversation can
// only be about one that exists.
const tutorLessonSchema = z
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
  checks: z
    .array(z.object({ passed: z.boolean(), text: z.string().max(300) }))
    .max(30)
    .optional(),
  language: z.enum(CODE_LANGUAGES).optional(),
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
    // What the conversation is about; without it, a general one.
    lesson: tutorLessonSchema.optional(),
    // The conversation the message continues; without it, a new one.
    conversationId: z.number().int().positive().max(2_147_483_647).optional(),
    work: tutorWorkSchema.optional(),
  })
  // Work belongs to a lesson: the general conversation has none.
  .refine((body) => !body.work || body.lesson, { message: 'Work needs a lesson' });

export const tutorConversationParamsSchema = z.object({
  id: z.coerce.number().int().positive().max(2_147_483_647),
});

// Lenient, like the other history lists: a bad cursor reads the newest page.
export const tutorPageQuerySchema = z.object({
  before: z.coerce.number().int().positive().max(2_147_483_647).optional().catch(undefined),
});
