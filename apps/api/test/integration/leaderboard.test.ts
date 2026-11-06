import { describe, it, expect } from 'vitest';
import { agent, createAuthenticatedAgent } from './helpers.js';
import { prisma } from '../../src/config/db.js';
import { markComplete } from '../../src/services/progress.service.js';
import { clearCache } from '../../src/services/leaderboard.service.js';
import { xpForLesson } from '@cyberstars/shared/constants';
import type { LeaderboardPage, LeaderboardEntry } from '@cyberstars/shared/leaderboard';

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
// ranking into this one; the public ?fresh=1 bypass was removed by design.
// The board is logged-in only now, so fetch it through an existing authenticated
// agent (reusing one already in the ranking keeps the total counts stable).
async function fetchBoard(a: ReturnType<typeof agent>): Promise<LeaderboardPage> {
  clearCache();
  const res = await a.get('/api/leaderboard').expect(200);
  return res.body;
}

describe('Leaderboard', () => {
  it('ranks users by derived XP, highest first (Sentinel with 0 XP is last)', async () => {
    const [l0, l1] = await twoPythonLessons();
    const { agent: aA, name: nameA, email: emailA } = await createAuthenticatedAgent();
    const { name: nameB, email: emailB } = await createAuthenticatedAgent();

    const idA = await userIdFor(emailA);
    await markComplete(idA, 'python', l0.slug);
    await markComplete(idA, 'python', l1.slug);
    await markComplete(await userIdFor(emailB), 'python', l0.slug);

    const board = await fetchBoard(aA);
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

  it('gives a tie to whoever reached the XP first, each on a place of their own', async () => {
    const [l0] = await twoPythonLessons();
    const { agent: aA, email: emailA } = await createAuthenticatedAgent();
    const { email: emailB } = await createAuthenticatedAgent();
    const [idA, idB] = [await userIdFor(emailA), await userIdFor(emailB)];

    await markComplete(idA, 'python', l0.slug);
    await markComplete(idB, 'python', l0.slug);
    // B, the newer account, got there first, so the tie isn't settled by id
    await prisma.userLessonProgress.updateMany({
      where: { userId: idB },
      data: { completedAt: new Date(Date.now() - 60_000) },
    });

    const board = await fetchBoard(aA);
    expect(board.entries.map((e: LeaderboardEntry) => [e.userId, e.rank])).toEqual([
      [idB, 1],
      [idA, 2],
      [expect.any(Number), 3],
    ]);
  });

  it('GET /me returns the caller rank; 401 without auth', async () => {
    const [l0, l1] = await twoPythonLessons();
    const { agent: a, email } = await createAuthenticatedAgent();
    await markComplete(await userIdFor(email), 'python', l0.slug);
    await markComplete(await userIdFor(email), 'python', l1.slug);

    await fetchBoard(a); // refresh cache with current data
    const me = await a.get('/api/leaderboard/me').expect(200);
    expect(me.body.rank).toBe(1);
    expect(me.body.totalXp).toBe(xpForLesson(l0.sortOrder) + xpForLesson(l1.sortOrder));

    await agent().get('/api/leaderboard/me').expect(401);
  });
});
