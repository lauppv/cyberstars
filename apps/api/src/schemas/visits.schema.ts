import { z } from 'zod';

export const pageViewSchema = z.object({
  // Just the address's path, the way the browser shows it: no query, no #.
  path: z
    .string()
    .max(200)
    .regex(/^\/[A-Za-z0-9\-._~%/]*$/),
  referrer: z.string().max(253).optional(),
});
