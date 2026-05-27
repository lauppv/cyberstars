import { z } from 'zod';

export const updateProfileSchema = z.object({
  bio: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
});
