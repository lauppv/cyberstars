import { describe, it, expect } from 'vitest';
import { agent, createAuthenticatedAgent } from './helpers.js';
import { prisma } from '../../server/config/db.js';
import { markComplete } from '../../server/services/progress.service.js';
import { clearCache } from '../../server/services/leaderboard.service.js';
import { xpForLesson } from '../../shared/constants.js';
import type { LeaderboardPage, LeaderboardEntry } from '../../shared/leaderboard.js';

async function userIdFor(email: string): Promise<number> {
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  return user.id;
}

async function twoPythonLessons() {
  const lessons = await prisma.lesson.findMany({
    where: { courseKey: 'python' },
    orderBy: { sortOrder: 'asc' },
    take: 2,
  });
  return lessons as { slug: string; sortOrder: number }[];
}

// Clear the in-memory cache so it can't leak a prior test's (now truncated)
// ranking into this one — the public ?fresh=1 bypass was removed by design.
async function fetchBoard(): Promise<LeaderboardPage> {
  clearCache();
  const res = await agent().get('/api/leaderboard').expect(200);
  return res.body;
}

describe('Leaderboard', () => {
  it('ranks users by derived XP, highest first (Sentinel with 0 XP is last)', async () => {
    const [l0, l1] = await twoPythonLessons();
    const { name: nameA, email: emailA } = await createAuthenticatedAgent();
    const { name: nameB, email: emailB } = await createAuthenticatedAgent();

    const idA = await userIdFor(emailA);
    await markComplete(idA, 'python', l0.slug);
    await markComplete(idA, 'python', l1.slug);
    await markComplete(await userIdFor(emailB), 'python', l0.slug);

    const board = await fetchBoard();
    expect(board.total).toBe(3); // A, B, Sentinel

    const [first, second] = board.entries;
    expect(first.name).toBe(nameA);
    expect(first.rank).toBe(1);
    expect(first.totalXp).toBe(xpForLesson(l0.sortOrder) + xpForLesson(l1.sortOrder));
    expect(first.lessonsDone).toBe(2);

    expect(second.name).toBe(nameB);
    expect(second.rank).toBe(2);
    expect(second.totalXp).toBe(xpForLesson(l0.sortOrder));

    // Sentinel earned nothing and sinks to the bottom.
    const last = board.entries[board.entries.length - 1];
    expect(last.totalXp).toBe(0);
    expect(last.lessonsDone).toBe(0);
  });

  it('uses RANK() with gaps on ties', async () => {
    const [l0] = await twoPythonLessons();
    const { email: emailA } = await createAuthenticatedAgent();
    const { email: emailB } = await createAuthenticatedAgent();

    await markComplete(await userIdFor(emailA), 'python', l0.slug);
    await markComplete(await userIdFor(emailB), 'python', l0.slug);

    const board = await fetchBoard();
    const tied = board.entries.filter(
      (e: LeaderboardEntry) => e.totalXp === xpForLesson(l0.sortOrder),
    );
    expect(tied).toHaveLength(2);
    expect(tied.every((e) => e.rank === 1)).toBe(true);

    // Gap: the next distinct score (Sentinel, 0 XP) is rank 3, not 2.
    const sentinel = board.entries.find((e) => e.totalXp === 0);
    expect(sentinel?.rank).toBe(3);
  });

  it('GET /me returns the caller rank; 401 without auth', async () => {
    const [l0, l1] = await twoPythonLessons();
    const { agent: a, email } = await createAuthenticatedAgent();
    await markComplete(await userIdFor(email), 'python', l0.slug);
    await markComplete(await userIdFor(email), 'python', l1.slug);

    await fetchBoard(); // refresh cache with current data
    const me = await a.get('/api/leaderboard/me').expect(200);
    expect(me.body.rank).toBe(1);
    expect(me.body.totalXp).toBe(xpForLesson(l0.sortOrder) + xpForLesson(l1.sortOrder));

    await agent().get('/api/leaderboard/me').expect(401);
  });
});
