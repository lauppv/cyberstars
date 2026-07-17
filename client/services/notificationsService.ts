import { api } from './apiClient';
import type { NotificationsPage } from '../../shared/notifications';

export function getNotifications(take = 20, before?: number) {
  const q = new URLSearchParams({ take: String(take) });
  if (before) q.set('before', String(before));
  return api.get<NotificationsPage>(`/api/notifications?${q.toString()}`);
}

export function markRead(upToId: number) {
  return api.post<{ ok: boolean }>('/api/notifications/read', { upToId });
}

export function markOneRead(id: number) {
  return api.post<{ ok: boolean }>(`/api/notifications/${id}/read`);
}
