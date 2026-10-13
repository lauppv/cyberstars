import { z } from 'zod';

export const sendRequestSchema = z.object({
  addresseeId: z.number().int().positive(),
});
