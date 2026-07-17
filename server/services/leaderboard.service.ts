import * as leaderboardRepo from '../repositories/leaderboard.repository.js';
import { levelFromXp, levelTitleKey } from '../../shared/constants.js';
import type { LeaderboardEntry, LeaderboardPage } from '../../shared/leaderboard.js';

const CACHE_TTL_MS = Number(process.env.LEADERBOARD_CACHE_MS ?? 3 * 60 * 1000);

let cached: { entries: LeaderboardEntry[]; expiresAt: number } | null = null;

function shape(row: leaderboardRepo.LeaderboardRow): LeaderboardEntry {
  const level = levelFromXp(row.total_xp);
  return {
    rank: row.rank,
    userId: row.id,
    name: row.name,
    avatarUrl: row.avatar_url,
    totalXp: row.total_xp,
    lessonsDone: row.lessons_done,
    level,
    titleKey: levelTitleKey(level),
  };
}

// The aggregate ranking query is DB-heavy, so the full ranked list is cached in
// memory for a few minutes (like admin.service). Page slices and "my rank" are
// derived from the cache — one query per window, not per request.
async function getEntries(): Promise<LeaderboardEntry[]> {
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.entries;

  const rows = await leaderboardRepo.getRanked();
  const entries = rows.map(shape);
  cached = { entries, expiresAt: now + CACHE_TTL_MS };
  return entries;
}

export async function getPage(take: number, skip: number): Promise<LeaderboardPage> {
  const entries = await getEntries();
  return { entries: entries.slice(skip, skip + take), total: entries.length };
}

export async function getMyRank(userId: number): Promise<LeaderboardEntry | null> {
  const entries = await getEntries();
  return entries.find((e) => e.userId === userId) ?? null;
}

export function clearCache(): void {
  cached = null;
}
