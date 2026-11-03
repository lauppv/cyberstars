import { api } from './apiClient';
import type { NotificationDTO, NotificationsPage } from '@cyberstars/shared/notifications';

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

// The announcements and polls the dashboard's window still has to show, oldest first
export function getNotices() {
  return api.get<NotificationDTO[]>('/api/notifications/notices');
}

export function markShown(ids: number[]) {
  return api.post<void>('/api/notifications/notices/shown', { ids });
}
