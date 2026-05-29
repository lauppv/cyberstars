import { z } from 'zod';
import { ALL_COURSE_KEYS } from '../../shared/constants.js';

const language = z.enum(ALL_COURSE_KEYS);

export const runCodeSchema = z.object({
  code: z.string().max(50_000),
  language,
});
