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
