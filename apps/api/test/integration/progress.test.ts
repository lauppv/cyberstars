import { describe, it, expect } from 'vitest';
import { createAuthenticatedAgent } from './helpers.js';
import { prisma } from '../../src/config/db.js';
import { markComplete } from '../../src/services/progress.service.js';

// Completion is server-authoritative: there is no client-writable endpoint,
// so tests mark completion through the same service the judge uses.
async function userIdFor(email: string): Promise<number> {
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  return user.id;
}

describe('Progress flow', () => {
  it('mark lesson complete → shows in progress', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();

    await markComplete(await userIdFor(email), 'python', 'booleans');

    const progress = await a.get('/api/progress/python').expect(200);
    const lesson = progress.body.lessons.find((l: { slug: string }) => l.slug === 'booleans');
    expect(lesson).toBeDefined();
    expect(lesson.completed).toBe(true);
  });

  it('mark complete is idempotent', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();

    const userId = await userIdFor(email);
    await markComplete(userId, 'python', 'booleans');
    await markComplete(userId, 'python', 'booleans');

    const progress = await a.get('/api/progress/python').expect(200);
    expect(progress.body.completed).toBe(1);
  });

  it('save code → retrieve it', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    await a.put('/api/progress/python/booleans/code').send({ code: 'print("hello")' }).expect(200);

    const saved = await a.get('/api/progress/python/booleans/code').expect(200);
    expect(saved.body.code).toBe('print("hello")');
  });

  it("keeps a multi-language lesson's code per language", async () => {
    const { agent: a } = await createAuthenticatedAgent();
    const code = '/api/progress/trees-graphs/trees/code';

    await a.put(code).send({ code: 'root = None' }).expect(200);
    await a.put(code).send({ code: 'int x;', language: 'c' }).expect(200);

    expect((await a.get(code).expect(200)).body.code).toBe('root = None');
    expect((await a.get(`${code}?language=python`).expect(200)).body.code).toBe('root = None');
    expect((await a.get(`${code}?language=c`).expect(200)).body.code).toBe('int x;');
    expect((await a.get(`${code}?language=java`).expect(200)).body.code).toBeNull();
    await a.get(`${code}?language=ruby`).expect(400);
    await a.put(code).send({ code: 'x', language: 'ruby' }).expect(400);
  });

  it('ticks a multi-language lesson once, whichever language passed it', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    const userId = await userIdFor(email);

    await markComplete(userId, 'trees-graphs', 'trees');
    await markComplete(userId, 'trees-graphs', 'trees');

    const progress = await a.get('/api/progress/trees-graphs').expect(200);
    expect(progress.body).toMatchObject({ completed: 1, total: 1, earnedXp: 10 });
  });

  it('progress is per-user', async () => {
    const { email: emailA } = await createAuthenticatedAgent();
    const { agent: userB } = await createAuthenticatedAgent();

    await markComplete(await userIdFor(emailA), 'python', 'booleans');

    const progressB = await userB.get('/api/progress/python').expect(200);
    expect(progressB.body.completed).toBe(0);
  });

  it('track access updates last accessed', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    await a.post('/api/progress/python/booleans/access').expect(200);

    const progress = await a.get('/api/progress/python').expect(200);
    const lesson = progress.body.lessons.find((l: { slug: string }) => l.slug === 'booleans');
    expect(lesson).toBeDefined();
    expect(lesson.lastAccessedAt).not.toBeNull();
  });
});
