import { describe, it, expect } from 'vitest';
import { createAuthenticatedAgent, userIdFor } from './helpers.js';
import { prisma } from '../../src/config/db.js';
import { lessons } from '@cyberstars/content/curriculum';
import { DAY_MS, LANIAKEA_COURSE, planetLessons } from '@cyberstars/shared/laniakea';
import { hasQuiz, loadQuiz } from '../../src/services/laniakea-quiz.js';
import { tellOpenRecaps } from '../../src/services/laniakea-recaps.service.js';
import type { StoredQuiz } from '../../src/repositories/laniakea.repository.js';

type Agent = Awaited<ReturnType<typeof createAuthenticatedAgent>>['agent'];

// The right answers of the print lesson's questions, the made ones too, by id
const answers = new Map(loadQuiz('print', 'en')!.questions.map((q) => [q.id, q.answer]));

// The six lessons of First steps, the planet that keeps Print's slug
const FIRST_STEPS = [
  'print',
  'variables-str',
  'variables-int',
  'print-f',
  'recap-variables',
  'comment',
];

// The first planet that has no questions yet, or none once every planet has them
const BARE = planetLessons(
  lessons
    .filter((l) => l.courseKey === LANIAKEA_COURSE)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((l) => l.slug),
).find((p) => !hasQuiz(p.slug))?.slug;

async function student(done = FIRST_STEPS) {
  const s = await createAuthenticatedAgent();
  const userId = await userIdFor(s.email);
  await prisma.userLessonProgress.createMany({
    data: done.map((lessonSlug) => ({
      userId,
      courseKey: 'python',
      lessonSlug,
      completed: true,
      completedAt: new Date(),
    })),
  });
  return { agent: s.agent, userId };
}

// Where the right option of each question shows in the test going on
async function rightChoices(userId: number): Promise<number[]> {
  const row = await prisma.laniakeaPlanet.findUniqueOrThrow({
    where: { userId_courseKey_lessonSlug: { userId, courseKey: 'python', lessonSlug: 'print' } },
  });
  const quiz = row.quiz as unknown as StoredQuiz;
  return quiz.ids.map((id, i) => quiz.orders[i].indexOf(answers.get(id)!));
}

const answer = (a: Agent, index: number, choice: number) =>
  a.post('/api/laniakea/print/quiz/answer').send({ index, choice });

describe('Laniakea', () => {
  it('stays closed until the six lessons of First steps are done', async () => {
    const { agent } = await student([...FIRST_STEPS.slice(0, 5), 'if-else']);
    const state = await agent.get('/api/laniakea').expect(200);
    expect(state.body).toMatchObject({
      unlocked: false,
      lessonsDone: 5,
      unlockAt: 6,
      nextLesson: 'comment',
    });
    expect(state.body.planets).toHaveLength(55);
    await agent.post('/api/laniakea/print/quiz').send({ lang: 'en' }).expect(403);
  });

  it('keeps a planet conquered as Print at its level as First steps', async () => {
    const { agent, userId } = await student();
    await prisma.laniakeaPlanet.create({
      data: { userId, courseKey: 'python', lessonSlug: 'print', level: 3, passedAt: new Date() },
    });
    const state = await agent.get('/api/laniakea').expect(200);
    expect(state.body.unlocked).toBe(true);
    expect(state.body.planets[0]).toMatchObject({ slug: 'print', lessonDone: true, level: 3 });
  });

  it('conquers a planet with a passed test, then keeps it waiting for its first recap', async () => {
    const { agent, userId } = await student();
    const opened = await agent.post('/api/laniakea/print/quiz').send({ lang: 'ro' }).expect(200);
    expect(opened.body.mode).toBe('conquer');
    expect(opened.body.questions).toHaveLength(10);
    expect(opened.body.questions[0].options).toHaveLength(4);

    const right = await rightChoices(userId);
    let last;
    for (let i = 0; i < 10; i++) last = await answer(agent, i, right[i]).expect(200);
    expect(last!.body).toMatchObject({ status: 'passed', leveledUp: true, correct: true });

    const state = await agent.get('/api/laniakea').expect(200);
    const print = state.body.planets.find((p: { slug: string }) => p.slug === 'print');
    expect(print.level).toBe(1);
    expect(Date.parse(print.nextRecapAt) - Date.parse(print.passedAt)).toBe(86_400_000);

    const again = await agent.post('/api/laniakea/print/quiz').send({ lang: 'en' }).expect(200);
    expect(again.body.mode).toBe('practice');
  });

  it('counts an answer sent twice at once only once', async () => {
    const { agent, userId } = await student();
    await agent.post('/api/laniakea/print/quiz').send({ lang: 'en' }).expect(200);
    const right = await rightChoices(userId);
    const [a, b] = await Promise.all([answer(agent, 0, right[0]), answer(agent, 0, right[0])]);
    expect([a.status, b.status]).toEqual([200, 200]);
    const row = await prisma.laniakeaPlanet.findFirstOrThrow({ where: { userId } });
    expect((row.quiz as unknown as StoredQuiz).answers).toHaveLength(1);
    expect(row.seen).toHaveLength(1);
  });

  it('ends a test at the fifth wrong answer and holds the planet for five minutes', async () => {
    const { agent, userId } = await student();
    await agent.post('/api/laniakea/print/quiz').send({ lang: 'en' }).expect(200);
    const right = await rightChoices(userId);
    let last;
    for (let i = 0; i < 5; i++) last = await answer(agent, i, (right[i] + 1) % 4).expect(200);
    expect(last!.body.status).toBe('failed');
    expect(Date.parse(last!.body.planet.retryAt) - Date.now()).toBeGreaterThan(4 * 60_000);

    const refused = await agent.post('/api/laniakea/print/quiz').send({ lang: 'en' }).expect(409);
    expect(refused.body.error).toBe('This planet opens for another try soon');
    await answer(agent, 5, 0).expect(404);
  });

  it("refuses a planet whose lesson isn't done", async () => {
    const { agent } = await student();
    await agent.post('/api/laniakea/for/quiz').send({ lang: 'en' }).expect(403);
  });

  it.skipIf(!BARE)('refuses a planet without questions', async () => {
    const { agent } = await student([...FIRST_STEPS, BARE!]);
    const none = await agent.post(`/api/laniakea/${BARE}/quiz`).send({ lang: 'en' }).expect(404);
    expect(none.body.error).toBe('This planet has no questions yet');
  });
});

describe('Laniakea recaps in the bell', () => {
  const HOUR = 60 * 60 * 1000;

  // Print's recap open for a day, Lists' for a day and a half, Bubble Sort's
  // opening in 22 hours and If/Else kept for good
  async function planets(userId: number, now: number) {
    const planet = (lessonSlug: string, level: number, passedAt: number) => ({
      userId,
      courseKey: 'python',
      lessonSlug,
      level,
      passedAt: new Date(passedAt),
    });
    await prisma.laniakeaPlanet.createMany({
      data: [
        planet('print', 1, now - 2 * DAY_MS),
        planet('lists', 2, now - 3.5 * DAY_MS),
        planet('bubble-sort', 1, now - 2 * HOUR),
        planet('if-else', 8, now - 100 * DAY_MS),
      ],
    });
  }

  const bell = async (agent: Agent) => (await agent.get('/api/notifications').expect(200)).body;

  it('tells a student once a day how many recaps are open, and opening the game reads it', async () => {
    const { agent, userId } = await student();
    const now = Date.now();
    await planets(userId, now);

    expect(await tellOpenRecaps(new Date(now))).toBe(1);
    let page = await bell(agent);
    expect(page.unreadCount).toBe(1);
    expect(page.items[0]).toMatchObject({
      type: 'LANIAKEA_RECAP',
      entityId: 0,
      data: { count: 2 },
    });

    // An hour on, nothing new opened and it was told today
    expect(await tellOpenRecaps(new Date(now + HOUR))).toBe(0);

    await agent.post('/api/laniakea/seen').expect(204);
    page = await bell(agent);
    expect(page.unreadCount).toBe(0);
    const player = await prisma.laniakeaPlayer.findUniqueOrThrow({ where: { userId } });
    expect(player.seenAt).not.toBeNull();

    // Bubble Sort's recap opens after the visit: a new notification counts all three
    expect(await tellOpenRecaps(new Date(now + 2 * DAY_MS))).toBe(1);
    page = await bell(agent);
    expect(page.unreadCount).toBe(1);
    expect(page.items[0].data).toEqual({ count: 3 });
  });

  it('tells nothing of recaps open when the student last opened the game', async () => {
    const { agent, userId } = await student();
    const now = Date.now();
    await planets(userId, now);
    await agent.post('/api/laniakea/seen').expect(204);

    expect(await tellOpenRecaps(new Date(now + HOUR))).toBe(0);
    expect((await bell(agent)).items).toHaveLength(0);
  });

  it('replaces an unread notification from an earlier day instead of adding one', async () => {
    const { agent, userId } = await student();
    const now = Date.now();
    await planets(userId, now);

    await tellOpenRecaps(new Date(now));
    await tellOpenRecaps(new Date(now + 2 * DAY_MS));
    const page = await bell(agent);
    expect(page.items).toHaveLength(1);
    expect(page.unreadCount).toBe(1);
    expect(page.items[0].data).toEqual({ count: 3 });
  });

  it('tells nothing of a recap the student already passed', async () => {
    const { agent, userId } = await student();
    const now = Date.now();
    // Passed its 1-day recap an hour ago, so the next opens in two days
    await prisma.laniakeaPlanet.create({
      data: {
        userId,
        courseKey: 'python',
        lessonSlug: 'print',
        level: 2,
        passedAt: new Date(now - HOUR),
      },
    });
    expect(await tellOpenRecaps(new Date(now))).toBe(0);
    expect((await bell(agent)).items).toHaveLength(0);
  });
});
