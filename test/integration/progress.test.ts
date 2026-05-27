import { describe, it, expect } from 'vitest';
import { createAuthenticatedAgent } from './helpers.js';

describe('Progress flow', () => {
  it('mark lesson complete → shows in progress', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    await a.post('/api/progress/python/booleans/complete').expect(200);

    const progress = await a.get('/api/progress/python').expect(200);
    const lesson = progress.body.lessons.find((l: { slug: string }) => l.slug === 'booleans');
    expect(lesson).toBeDefined();
    expect(lesson.completed).toBe(true);
  });

  it('mark complete is idempotent', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    await a.post('/api/progress/python/booleans/complete').expect(200);
    await a.post('/api/progress/python/booleans/complete').expect(200);

    const progress = await a.get('/api/progress/python').expect(200);
    expect(progress.body.completed).toBe(1);
  });

  it('save code → retrieve it', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    await a.put('/api/progress/python/booleans/code').send({ code: 'print("hello")' }).expect(200);

    const saved = await a.get('/api/progress/python/booleans/code').expect(200);
    expect(saved.body.code).toBe('print("hello")');
  });

  it('progress is per-user', async () => {
    const { agent: userA } = await createAuthenticatedAgent();
    const { agent: userB } = await createAuthenticatedAgent();

    await userA.post('/api/progress/python/booleans/complete').expect(200);

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
