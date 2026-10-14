import { z } from 'zod';

// A guest's click or scroll. A click carries the name the code gives the
// button, never its text, so nothing a person typed or wrote can get in.
const stepSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('click'), target: z.string().regex(/^[a-z0-9-]{1,40}$/) }),
  z.object({ kind: z.literal('scroll'), target: z.enum(['25', '50', '75', '100']) }),
]);

// The app sends at most this many in one report.
const stepsSchema = z.array(stepSchema).max(30);

export const pageViewSchema = z.object({
  // Just the address's path, the way the browser shows it: no query, no #.
  path: z
    .string()
    .max(200)
    .regex(/^\/[A-Za-z0-9\-._~%/]*$/),
  referrer: z.string().max(253).optional(),
  steps: stepsSchema.optional(),
});

export const stepsReportSchema = z.object({ steps: stepsSchema.min(1) });
