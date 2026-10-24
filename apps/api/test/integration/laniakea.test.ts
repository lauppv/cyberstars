import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { createAuthenticatedAgent, userIdFor } from './helpers.js';
import { prisma } from '../../src/config/db.js';
import { contentDir } from '../../src/services/paths.js';
import type { StoredQuiz } from '../../src/repositories/laniakea.repository.js';

type Agent = Awaited<ReturnType<typeof createAuthenticatedAgent>>['agent'];

// The right answers of the print lesson's questions, by id
const answers = new Map<string, number>(
  JSON.parse(
    fs.readFileSync(path.join(contentDir('python'), 'print-quiz.json'), 'utf8'),
  ).questions.map((q: { id: string; answer: number }) => [q.id, q.answer]),
);

async function student(lessons = ['print', 'variables-str', 'variables-int']) {
  const s = await createAuthenticatedAgent();
  const userId = await userIdFor(s.email);
  await prisma.userLessonProgress.createMany({
    data: lessons.map((lessonSlug) => ({
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
  it('stays closed until three Python lessons are done', async () => {
    const { agent } = await student(['print']);
    const state = await agent.get('/api/laniakea').expect(200);
    expect(state.body).toMatchObject({ unlocked: false, lessonsDone: 1, unlockAt: 3 });
    expect(state.body.planets).toHaveLength(60);
    await agent.post('/api/laniakea/print/quiz').send({ lang: 'en' }).expect(403);
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

  it("refuses a planet whose lesson isn't done and one without questions", async () => {
    const { agent } = await student(['print', 'variables-str', 'variables-int', 'print-f']);
    await agent.post('/api/laniakea/for/quiz').send({ lang: 'en' }).expect(403);
    const none = await agent.post('/api/laniakea/print-f/quiz').send({ lang: 'en' }).expect(404);
    expect(none.body.error).toBe('This planet has no questions yet');
  });
});
