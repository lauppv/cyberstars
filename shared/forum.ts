export interface ForumCategoryDTO {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  groupName: string;
  threadCount: number;
  postCount: number;
  lastPost: ForumLastPostDTO | null;
}

import type { UserRole } from './auth.js';

interface ForumLastPostDTO {
  threadTitle: string;
  authorName: string;
  createdAt: string;
}

export interface ForumThreadSummaryDTO {
  id: number;
  title: string;
  pinned: boolean;
  locked: boolean;
  solved: boolean;
  views: number;
  authorName: string;
  authorId: number;
  authorRole: UserRole;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
  lastPostAuthor: string | null;
  lastPostAt: string | null;
}

export interface ForumThreadDetailDTO {
  id: number;
  title: string;
  pinned: boolean;
  locked: boolean;
  solved: boolean;
  views: number;
  categorySlug: string;
  categoryName: string;
  authorName: string;
  authorId: number;
  authorRole: UserRole;
  createdAt: string;
  posts: ForumPostDTO[];
}

export interface ForumPostDTO {
  id: number;
  content: string;
  solution: boolean;
  authorId: number;
  authorName: string;
  authorAvatarUrl: string | null;
  authorRole: UserRole;
  createdAt: string;
  updatedAt: string;
  editedByName: string | null;
  deleted: boolean;
  deletedByName: string | null;
  reactions: ForumReactionGroupDTO[];
}

export interface ForumReactionGroupDTO {
  emoji: string;
  count: number;
  active: boolean;
  users: string[];
}

export interface CreateThreadRequest {
  categorySlug: string;
  title: string;
  content: string;
}

export interface CreatePostRequest {
  content: string;
}

interface CategoryInput {
  name: string;
  description: string;
  icon: string;
  color: string;
  groupName: string;
}

export type CreateCategoryRequest = CategoryInput;
export type UpdateCategoryRequest = CategoryInput;

export interface UpdatePostRequest {
  content: string;
}

export interface ToggleReactionRequest {
  emoji: string;
}
