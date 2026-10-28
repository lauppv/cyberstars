import { api } from './apiClient';
import type { AdminStatsDTO, AnnouncementSentDTO } from '@cyberstars/shared/admin';
import type { MissedQuestion } from '@cyberstars/shared/laniakea';

export function getStats(force = false) {
  return api.get<AdminStatsDTO>(`/api/admin/stats${force ? '?fresh=1' : ''}`);
}

export function sendAnnouncement(text: string) {
  return api.post<AnnouncementSentDTO>('/api/admin/announcements', { text });
}

export function getMissedQuestions(lang: 'en' | 'ro') {
  return api.get<MissedQuestion[]>(`/api/admin/laniakea/questions?lang=${lang}`);
}
