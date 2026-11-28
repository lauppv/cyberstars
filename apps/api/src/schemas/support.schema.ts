import { z } from 'zod';
import { SUPPORT_MESSAGE_MAX_LENGTH, SUPPORT_SUBJECT_MAX_LENGTH } from '@cyberstars/shared/support';

const message = z
  .string()
  .min(1, 'Message is required')
  .max(
    SUPPORT_MESSAGE_MAX_LENGTH,
    `Message is too long (max ${SUPPORT_MESSAGE_MAX_LENGTH} characters)`,
  );

export const createTicketSchema = z.object({
  type: z.enum(['BUG', 'QUESTION', 'RULE_VIOLATION', 'FEEDBACK', 'ACCOUNT', 'OTHER']),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(
      SUPPORT_SUBJECT_MAX_LENGTH,
      `Subject is too long (max ${SUPPORT_SUBJECT_MAX_LENGTH} chars)`,
    ),
  message,
});

export const addMessageSchema = z.object({ message });

export const updateTicketStatusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
});
