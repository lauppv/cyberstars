import { api } from "./apiClient";
import type {
  ForumCategoryDTO,
  ForumThreadSummaryDTO,
  ForumThreadDetailDTO,
  CreateThreadRequest,
  CreatePostRequest,
  ToggleReactionRequest,
  UpdatePostRequest,
} from "../../shared/forum";
import type { UserRole } from "../../shared/auth";

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

export function updatePost(postId: number, data: UpdatePostRequest) {
  return api.put<{ ok: boolean }>(`/api/forum/posts/${postId}`, data);
}

export function deletePost(postId: number) {
  return api.delete<{ ok: boolean; threadDeleted: boolean }>(`/api/forum/posts/${postId}`);
}

export function deleteThread(threadId: number) {
  return api.delete<{ ok: boolean }>(`/api/forum/threads/${threadId}`);
}

export function updateUserRole(userId: number, role: UserRole) {
  return api.put<{ ok: boolean }>(`/api/forum/users/${userId}/role`, { role });
}
