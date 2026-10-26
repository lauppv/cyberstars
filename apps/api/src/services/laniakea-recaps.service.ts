import { FOREVER_LEVEL, LANIAKEA_COURSE, nextRecapAt } from '@cyberstars/shared/laniakea';
import * as laniakeaRepo from '../repositories/laniakea.repository.js';
import type { PlayerRow, RecapPlanet } from '../repositories/laniakea.repository.js';
import * as notificationsService from './notifications.service.js';
import { dayMs } from './laniakea.service.js';
import { today } from './visits.service.js';

// Laniakea's recaps in the bell (CYB-98). A student whose recaps opened after
// they last opened the game, and after the bell last told them, gets one
// notification counting every recap open now, at most once a day in Romania.
// The game board shows the recaps, so opening it reads the notification.

// The notification isn't about one thing of the student's, so its entity is 0.
const ENTITY = 0;

// How many recaps to tell the student of now: all those open, or 0 when none
// opened since the student last opened the game or was told, or they were
// told today already.
export function recapsToTell(
  planets: Pick<RecapPlanet, 'level' | 'passedAt'>[],
  player: Pick<PlayerRow, 'seenAt' | 'notifiedAt'> | undefined,
  now: Date,
  day: number,
): number {
  const open = planets
    .map((p) => nextRecapAt(p.level, p.passedAt, day))
    .filter((at): at is Date => at !== null && at <= now);
  if (open.length === 0) return 0;
  const { seenAt = null, notifiedAt = null } = player ?? {};
  const since = Math.max(seenAt?.getTime() ?? 0, notifiedAt?.getTime() ?? 0);
  if (!open.some((at) => at.getTime() > since)) return 0;
  if (notifiedAt && today(notifiedAt) === today(now)) return 0;
  return open.length;
}

// Tells every student with recaps to tell of. Returns how many were told.
export async function tellOpenRecaps(now = new Date()): Promise<number> {
  const planets = await laniakeaRepo.listRecapPlanets(LANIAKEA_COURSE, FOREVER_LEVEL);
  const byUser = new Map<number, RecapPlanet[]>();
  for (const p of planets) {
    const owned = byUser.get(p.userId);
    if (owned) owned.push(p);
    else byUser.set(p.userId, [p]);
  }
  if (byUser.size === 0) return 0;
  const players = new Map(
    (await laniakeaRepo.listPlayers([...byUser.keys()])).map((p) => [p.userId, p]),
  );
  const day = dayMs();
  let told = 0;
  for (const [userId, owned] of byUser) {
    const count = recapsToTell(owned, players.get(userId), now, day);
    if (count === 0) continue;
    await laniakeaRepo.markNotified(userId, now);
    await notificationsService.notify({
      recipientIds: [userId],
      type: 'LANIAKEA_RECAP',
      entityId: ENTITY,
      data: { count },
    });
    told++;
  }
  return told;
}

// The student opened the game: the board shows the recaps open, so the bell
// has nothing to add about them.
export async function markSeen(userId: number, now = new Date()): Promise<void> {
  await laniakeaRepo.markSeen(userId, now);
  await notificationsService.markEntityRead(userId, 'LANIAKEA_RECAP', ENTITY);
}

const HOUR_MS = 60 * 60 * 1000;

// Once at start and then every hour, so a recap is told of within the hour it
// opens.
export function scheduleRecapBell(): NodeJS.Timeout {
  const run = () =>
    tellOpenRecaps().catch((err) => console.error('[laniakea] recap bell failed:', err));
  void run();
  return setInterval(run, HOUR_MS).unref();
}
