import * as adminRepo from '../repositories/admin.repository.js';
import * as codeContainer from './code-container.service.js';
import type { AdminStatsDTO } from '../../shared/admin.js';

const CACHE_TTL_MS = Number(process.env.ADMIN_STATS_CACHE_MS ?? 5 * 60 * 1000);

let cached: { dto: AdminStatsDTO; expiresAt: number } | null = null;

// The DB-heavy aggregates are cached for a few minutes to spare the small VPS;
// the code-execution metrics are read live from memory on every call (cheap).
export async function getStats(force = false): Promise<AdminStatsDTO> {
  const now = Date.now();
  if (!force && cached && cached.expiresAt > now) {
    return { ...cached.dto, codeExec: codeContainer.liveMetrics() };
  }

  const [users, progress, forum, support] = await Promise.all([
    adminRepo.userStats(),
    adminRepo.progressStats(),
    adminRepo.forumStats(),
    adminRepo.supportStats(),
  ]);

  const dto: AdminStatsDTO = {
    users,
    progress,
    forum,
    support,
    codeExec: codeContainer.liveMetrics(),
    generatedAt: new Date().toISOString(),
  };

  cached = { dto, expiresAt: now + CACHE_TTL_MS };
  return dto;
}

export function clearCache(): void {
  cached = null;
}
