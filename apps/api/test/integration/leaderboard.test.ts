import { describe, it, expect } from 'vitest';
import { agent, createAuthenticatedAgent } from './helpers.js';
import { prisma } from '../../src/config/db.js';
import { markComplete } from '../../src/services/progress.service.js';
import { clearCache } from '../../src/services/leaderboard.service.js';
import { PART_STARTS, xpForLesson } from '@cyberstars/shared/constants';
import { PROJECT_XP, findProject } from '@cyberstars/shared/projects';
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
    expect(first.totalXp).toBe(
      xpForLesson('python', l0.sortOrder) + xpForLesson('python', l1.sortOrder),
    );
    expect(first.lessonsDone).toBe(2);

    expect(second.name).toBe(nameB);
    expect(second.rank).toBe(2);
    expect(second.totalXp).toBe(xpForLesson('python', l0.sortOrder));

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

  it('adds the XP of finished projects still in the catalog, never of ticked steps', async () => {
    const [l0] = await twoPythonLessons();
    const { agent: aA, name: nameA, email: emailA } = await createAuthenticatedAgent();
    const { name: nameB, email: emailB } = await createAuthenticatedAgent();
    const idA = await userIdFor(emailA);
    const idB = await userIdFor(emailB);
    await markComplete(idA, 'python', l0.slug);
    await prisma.projectCompletion.createMany({
      data: [
        { userId: idB, language: 'python', projectSlug: 'library-desk' },
        // A project no longer in the catalog gives nothing
        { userId: idB, language: 'python', projectSlug: 'gone-project' },
      ],
    });
    // Ticking every step of a project finishes nothing
    await prisma.projectStepCheck.create({
      data: { userId: idA, language: 'python', projectSlug: 'library-desk', stepId: 'catalog' },
    });

    const board = await fetchBoard(aA);
    const [first, second] = board.entries;
    expect(first.name).toBe(nameB);
    expect(first.totalXp).toBe(PROJECT_XP[findProject('python', 'library-desk')!.difficulty]);
    expect(first.lessonsDone).toBe(0);
    expect(second.name).toBe(nameA);
    expect(second.totalXp).toBe(xpForLesson('python', l0.sortOrder));
  });

  it('counts a lesson of a course split into parts from its part, not the course', async () => {
    const second = PART_STARTS['web-dev'][1];
    const lessons = await prisma.lesson.findMany({
      where: { courseKey: 'web-dev', sortOrder: { in: [second, second + 1] } },
      orderBy: { sortOrder: 'asc' },
    });
    const { agent: a, email } = await createAuthenticatedAgent();
    const id = await userIdFor(email);
    for (const l of lessons) await markComplete(id, 'web-dev', l.slug);

    await fetchBoard(a);
    const me = await a.get('/api/leaderboard/me').expect(200);
    expect(me.body.totalXp).toBe(10 + 11);
  });

  it('GET /me returns the caller rank; 401 without auth', async () => {
    const [l0, l1] = await twoPythonLessons();
    const { agent: a, email } = await createAuthenticatedAgent();
    await markComplete(await userIdFor(email), 'python', l0.slug);
    await markComplete(await userIdFor(email), 'python', l1.slug);

    await fetchBoard(a); // refresh cache with current data
    const me = await a.get('/api/leaderboard/me').expect(200);
    expect(me.body.rank).toBe(1);
    expect(me.body.totalXp).toBe(
      xpForLesson('python', l0.sortOrder) + xpForLesson('python', l1.sortOrder),
    );

    await agent().get('/api/leaderboard/me').expect(401);
  });

  it('never shows our test accounts, however much XP they have', async () => {
    const [l0, l1] = await twoPythonLessons();
    const { agent: student, name, email } = await createAuthenticatedAgent();
    const { agent: bot, email: botEmail } = await createAuthenticatedAgent({
      email: 'board@bots.cyberstars.app',
    });
    await markComplete(await userIdFor(email), 'python', l0.slug);
    await markComplete(await userIdFor(botEmail), 'python', l0.slug);
    await markComplete(await userIdFor(botEmail), 'python', l1.slug);

    const board = await fetchBoard(student);
    expect(board.total).toBe(2); // the student and Sentinel
    expect(board.entries[0].name).toBe(name);
    expect(board.entries[0].rank).toBe(1);

    const me = await bot.get('/api/leaderboard/me').expect(200);
    expect(me.body).toBeNull();
  });
});
