import { api } from './apiClient';

const API_BASE = import.meta.env.VITE_PROD_API_URL || '';

export function updateProfile(data: { bio?: string | null; status?: string | null }) {
  return api.patch<{ message: string }>('/api/profile', data);
}

export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const form = new FormData();
  form.append('avatar', file);
  const res = await fetch(`${API_BASE}/api/profile/avatar`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(data.error || 'Upload failed');
  }
  return res.json();
}

export function removeAvatar() {
  return api.delete<{ message: string }>('/api/profile/avatar');
}

export function changePassword(data: { currentPassword: string; newPassword: string }) {
  return api.post<{ message: string }>('/api/profile/password', data);
}

export function requestEmailChange(data: { currentPassword: string; newEmail: string }) {
  return api.post<{ message: string }>('/api/profile/email/request', data);
}

export function confirmEmailChange(data: { code: string }) {
  return api.post<{ message: string; email: string }>('/api/profile/email/confirm', data);
}

export function cancelEmailChange() {
  return api.delete<{ message: string }>('/api/profile/email/pending');
}

export function getActivity() {
  return api.get<{ streak: number; lastActiveAt: string | null }>('/api/profile/activity');
}
