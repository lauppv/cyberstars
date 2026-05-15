import { api } from "./apiClient";
import type {
  ForumCategoryDTO,
  ForumThreadSummaryDTO,
  ForumThreadDetailDTO,
  CreateThreadRequest,
  CreatePostRequest,
  ToggleReactionRequest,
} from "../../shared/forum";

export function getCategories() {
  return api.get<ForumCategoryDTO[]>("/api/forum/categories");
}

export function getThreads(categorySlug: string) {
  return api.get<{
    category: { slug: string; name: string; description: string; icon: string; color: string };
    threads: ForumThreadSummaryDTO[];
  }>(`/api/forum/categories/${categorySlug}/threads`);
}

export function getThread(threadId: number) {
  return api.get<ForumThreadDetailDTO>(`/api/forum/threads/${threadId}`);
}

export function createThread(data: CreateThreadRequest) {
  return api.post<{ threadId: number }>("/api/forum/threads", data);
}

export function createPost(threadId: number, data: CreatePostRequest) {
  return api.post<{ postId: number }>(`/api/forum/threads/${threadId}/posts`, data);
}

export function toggleReaction(postId: number, data: ToggleReactionRequest) {
  return api.post<{ active: boolean }>(`/api/forum/posts/${postId}/reactions`, data);
}

export function markSolution(postId: number) {
  return api.post<{ ok: boolean }>(`/api/forum/posts/${postId}/solution`);
}
