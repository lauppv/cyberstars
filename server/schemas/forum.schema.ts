import { z } from 'zod';

export const createThreadSchema = z.object({
  categorySlug: z.string().min(1).max(50),
  title: z.string().trim().min(1, 'Title is required').max(255),
  content: z.string().trim().min(1, 'Content is required').max(10_000),
});

export const createPostSchema = z.object({
  content: z.string().trim().min(1, 'Content is required').max(10_000),
});

export const updatePostSchema = z.object({
  content: z.string().trim().min(1, 'Content is required').max(10_000),
});

export const toggleReactionSchema = z.object({
  emoji: z.string().min(1).max(10),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['USER', 'MODERATOR', 'ADMIN']),
});
