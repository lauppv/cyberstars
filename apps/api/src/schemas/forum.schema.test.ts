import { describe, it, expect } from 'vitest';
import {
  createThreadSchema,
  createPostSchema,
  updatePostSchema,
  toggleReactionSchema,
  updateUserRoleSchema,
} from './forum.schema.js';

describe('createThreadSchema', () => {
  it('accepts and trims valid input', () => {
    const parsed = createThreadSchema.parse({
      categorySlug: 'general',
      title: '  Hello  ',
      content: '  World  ',
    });
    expect(parsed).toEqual({ categorySlug: 'general', title: 'Hello', content: 'World' });
  });

  it('rejects a missing categorySlug', () => {
    expect(createThreadSchema.safeParse({ title: 'T', content: 'C' }).success).toBe(false);
  });

  it('rejects a whitespace-only title', () => {
    expect(
      createThreadSchema.safeParse({ categorySlug: 'general', title: '   ', content: 'C' }).success,
    ).toBe(false);
  });

  it('rejects a whitespace-only content', () => {
    expect(
      createThreadSchema.safeParse({ categorySlug: 'general', title: 'T', content: '   ' }).success,
    ).toBe(false);
  });
});

describe('createPostSchema', () => {
  it('rejects a whitespace-only content', () => {
    expect(createPostSchema.safeParse({ content: '   ' }).success).toBe(false);
  });

  it('accepts and trims valid content', () => {
    expect(createPostSchema.parse({ content: '  hi  ' })).toEqual({ content: 'hi' });
  });
});

describe('updatePostSchema', () => {
  it('rejects a whitespace-only content', () => {
    expect(updatePostSchema.safeParse({ content: '   ' }).success).toBe(false);
  });
});

describe('toggleReactionSchema', () => {
  it('rejects an empty emoji', () => {
    expect(toggleReactionSchema.safeParse({ emoji: '' }).success).toBe(false);
  });
});

describe('updateUserRoleSchema', () => {
  it('rejects an unknown role', () => {
    expect(updateUserRoleSchema.safeParse({ role: 'SUPERADMIN' }).success).toBe(false);
  });

  it('accepts a known role', () => {
    expect(updateUserRoleSchema.parse({ role: 'MODERATOR' })).toEqual({ role: 'MODERATOR' });
  });
});
