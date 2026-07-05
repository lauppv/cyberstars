import { z } from 'zod';

export const updateProfileSchema = z.object({
  bio: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(6, 'Password is too short — must be at least 6 characters')
    .max(255, 'Password must be at most 255 characters'),
});
