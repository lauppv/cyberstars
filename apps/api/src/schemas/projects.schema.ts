import { z } from 'zod';

// Ticked or unticked by the student
export const projectCheckSchema = z.object({ checked: z.boolean() });
