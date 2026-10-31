import { z } from 'zod';

// An account's email, as every form takes it
export const emailField = z
  .email('Please enter a valid email address')
  .max(255, 'Email must be at most 255 characters');

// A new password, as sign-up, a reset and a change take it
export const passwordField = z
  .string()
  .min(6, 'Password is too short, must be at least 6 characters')
  .max(255, 'Password must be at most 255 characters');

export const loginSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(1, 'Password is required')
    .max(255, 'Password must be at most 255 characters'),
});

export function forgotPasswordSchema<Lang extends string>(languages: readonly [Lang, ...Lang[]]) {
  return z.object({
    email: emailField,
    // the page's language, which the email is written in
    lang: z.enum(languages).optional(),
  });
}

export const resetPasswordSchema = z.object({
  email: emailField,
  code: z.string().length(6, 'Code must be 6 digits'),
  password: passwordField,
});
