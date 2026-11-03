import { api } from './apiClient';
import type { AdminStatsDTO, AnnouncementDTO, AnnouncementSentDTO } from '@cyberstars/shared/admin';
import type { MissedQuestion } from '@cyberstars/shared/laniakea';
import type { PollResultsDTO, PollSentDTO } from '@cyberstars/shared/polls';

export function getStats(force = false) {
  return api.get<AdminStatsDTO>(`/api/admin/stats${force ? '?fresh=1' : ''}`);
}

export function getAnnouncements() {
  return api.get<AnnouncementDTO[]>('/api/admin/announcements');
}

export function sendAnnouncement(text: string) {
  return api.post<AnnouncementSentDTO>('/api/admin/announcements', { text });
}

export function getPolls() {
  return api.get<PollResultsDTO[]>('/api/admin/polls');
}

export function sendPoll(question: string, options: string[]) {
  return api.post<PollSentDTO>('/api/admin/polls', { question, options });
}

export function getMissedQuestions(lang: 'en' | 'ro') {
  return api.get<MissedQuestion[]>(`/api/admin/laniakea/questions?lang=${lang}`);
}
