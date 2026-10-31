import { z } from 'zod';
import { emailField, passwordField } from '@cyberstars-framework/auth/schemas';
import { PLACEMENT_QUESTION_COUNT } from '@cyberstars/shared/placement';

// English letters, digits, - _ . * and one space between words
const NAME_WORD = '[A-Za-z0-9._*-]+';
const NAME_PATTERN = new RegExp(`^${NAME_WORD}( ${NAME_WORD})*$`);

// At least 4 characters besides the spaces, so "dy" or "a b" is no name
const MIN_NAME_CHARACTERS = 4;
function hasEnoughCharacters(name: string): boolean {
  return name.replaceAll(' ', '').length >= MIN_NAME_CHARACTERS;
}

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .regex(NAME_PATTERN, 'Name has invalid characters')
    .refine(
      hasEnoughCharacters,
      'Name is too short, must have at least 4 characters besides spaces',
    ),
  email: emailField,
  password: passwordField,
  // The landing page's placement test, when the visitor took it first
  placementScore: z.number().int().min(0).max(PLACEMENT_QUESTION_COUNT).optional(),
});
