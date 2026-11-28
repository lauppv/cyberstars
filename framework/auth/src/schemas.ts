import { z } from 'zod';

// An account's email, as every form takes it: trimmed and lowercased first, so
// `Ana@gmail.com` and `ana@gmail.com` are one account, found the same way by
// sign-up, login and the reset, and one address to the reset code limit
export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(
    z.email('Please enter a valid email address').max(255, 'Email must be at most 255 characters'),
  );

// The link a confirmation email carries: 32 random bytes in base64url
export const confirmEmailSchema = z.object({
  token: z.string().regex(/^[A-Za-z0-9_-]{43}$/, 'Invalid link'),
});

export function resendConfirmationSchema<Lang extends string>(
  languages: readonly [Lang, ...Lang[]],
) {
  return z.object({
    // the page's language, which the email is written in
    lang: z.enum(languages).optional(),
  });
}

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
