import { z } from 'zod';
import { INTERESTS } from '@cyberstars/shared/interests';
import { CODE_LANGUAGES } from '@cyberstars/shared/constants';

export const updateProfileSchema = z.object({
  bio: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  showBio: z.boolean().optional(),
  showStats: z.boolean().optional(),
  showProgress: z.boolean().optional(),
  showActivity: z.boolean().optional(),
  showConnections: z.boolean().optional(),
});

// At least one, each once
export const saveInterestsSchema = z.object({
  interests: z
    .array(z.enum(INTERESTS))
    .min(1)
    .refine((list) => new Set(list).size === list.length, 'Each interest only once'),
});

export const saveCodeLanguageSchema = z.object({
  language: z.enum(CODE_LANGUAGES),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(6, 'Password is too short, must be at least 6 characters')
    .max(255, 'Password must be at most 255 characters'),
});

export const requestEmailChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newEmail: z
    .email('Please enter a valid email address')
    .max(255, 'Email must be at most 255 characters'),
  // the page's language, which the email is written in
  lang: z.enum(['en', 'ro']).optional(),
});

export const confirmEmailChangeSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});
