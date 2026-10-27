import i18next from 'i18next';
import type { Interest } from '@cyberstars/shared/interests';
import type { CodeLanguage } from '@cyberstars/shared/constants';
import type { ActivityItem } from '@cyberstars/shared/profile';
import { api, errorOf, send } from './apiClient';

const API_BASE = import.meta.env.VITE_PROD_API_URL || '';

export function updateProfile(data: {
  bio?: string | null;
  status?: string | null;
  showBio?: boolean;
  showStats?: boolean;
  showProgress?: boolean;
}) {
  return api.patch<{ message: string }>('/api/profile', data);
}

export function saveInterests(interests: Interest[]) {
  return api.put<void>('/api/profile/interests', { interests });
}

export function saveCodeLanguage(language: CodeLanguage) {
  return api.put<void>('/api/profile/code-language', { language });
}

export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const form = new FormData();
  form.append('avatar', file);
  const res = await send(`${API_BASE}/api/profile/avatar`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  // Without a reason the page says the upload failed in its own words
  if (!res.ok) throw await errorOf(res, '');
  return res.json();
}

export function removeAvatar() {
  return api.delete<{ message: string }>('/api/profile/avatar');
}

export function changePassword(data: { currentPassword: string; newPassword: string }) {
  return api.post<{ message: string }>('/api/profile/password', data);
}

export function requestEmailChange(data: { currentPassword: string; newEmail: string }) {
  return api.post<{ message: string }>('/api/profile/email/request', {
    ...data,
    lang: i18next.language === 'ro' ? 'ro' : 'en',
  });
}

export function confirmEmailChange(data: { code: string }) {
  return api.post<{ message: string; email: string }>('/api/profile/email/confirm', data);
}

export function cancelEmailChange() {
  return api.delete<{ message: string }>('/api/profile/email/pending');
}

export function getActivity() {
  return api.get<{ streak: number; lastActiveAt: string | null; activity: ActivityItem[] }>(
    '/api/profile/activity',
  );
}
