import * as adminRepo from '../repositories/admin.repository.js';
import * as codeContainer from './code-container.service.js';
import { sandboxSlots } from './sandbox-slots.js';
import { onlineUserIds } from './ws-user.js';
import type { AdminStatsDTO } from '@cyberstars/shared/admin';

const CACHE_TTL_MS = Number(process.env.ADMIN_STATS_CACHE_MS ?? 5 * 60 * 1000);

let cached: { dto: AdminStatsDTO; expiresAt: number } | null = null;

// The DB-heavy aggregates are cached for a few minutes to spare the small VPS;
// the code-execution metrics are read live from memory on every call (cheap).
function codeExec() {
  return { ...codeContainer.liveMetrics(), ...sandboxSlots() };
}

// Who has the app open right now, read live too; the founder doesn't count
async function online() {
  return {
    users: await adminRepo.countNonFounders(onlineUserIds()),
    guests: codeContainer.onlineGuests(),
  };
}

export async function getStats(force = false): Promise<AdminStatsDTO> {
  const now = Date.now();
  if (!force && cached && cached.expiresAt > now) {
    return { ...cached.dto, codeExec: codeExec(), online: await online() };
  }

  const [users, progress, forum, support, onlineNow] = await Promise.all([
    adminRepo.userStats(),
    adminRepo.progressStats(),
    adminRepo.forumStats(),
    adminRepo.supportStats(),
    online(),
  ]);

  const dto: AdminStatsDTO = {
    users,
    progress,
    forum,
    support,
    codeExec: codeExec(),
    online: onlineNow,
    generatedAt: new Date().toISOString(),
  };

  cached = { dto, expiresAt: now + CACHE_TTL_MS };
  return dto;
}

export function clearCache(): void {
  cached = null;
}
