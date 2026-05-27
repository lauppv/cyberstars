import { z } from 'zod';

export const saveCodeSchema = z.object({
  code: z.string().max(50_000),
});
