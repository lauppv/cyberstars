import { z } from 'zod';
import { CODE_MAX_LENGTH } from '@cyberstars/shared/webFiles';

// Ticked or unticked by the student
export const projectCheckSchema = z.object({ checked: z.boolean() });

// The student's whole program; the judge feeds it each case's stdin
export const projectRunSchema = z.object({
  code: z.string().max(CODE_MAX_LENGTH),
});
