import { api } from './apiClient';
import type { LeaderboardEntry, LeaderboardPage } from '../../shared/leaderboard';

export function getLeaderboard(take = 50, skip = 0) {
  return api.get<LeaderboardPage>(`/api/leaderboard?take=${take}&skip=${skip}`);
}

export function getMyRank() {
  return api.get<LeaderboardEntry | null>('/api/leaderboard/me');
}
