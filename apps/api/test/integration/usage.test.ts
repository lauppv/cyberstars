import { describe, it, expect } from 'vitest';
import { createAuthenticatedAgent, userIdFor } from './helpers.js';
import { prisma } from '../../src/config/db.js';
import { hold } from '../../src/services/usage.service.js';

function reveal(a: Awaited<ReturnType<typeof createAuthenticatedAgent>>['agent']) {
  return a.post('/api/usage/solution/python/print').send({ lang: 'en' });
}

describe('Usage limits', () => {
  it('allows 3 Show Solution reveals per window, then answers 429 with the refill time', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    for (let i = 1; i <= 3; i++) {
      const res = await reveal(a).expect(200);
      expect(res.body.usage.showSolution).toMatchObject({ used: i, remaining: 3 - i });
    }

    const refused = await reveal(a).expect(429);
    expect(refused.body.error).toMatch(/^Limit reached\. It refills at \d{4}-\d\d-\d\dT/);
  });

  it('keeps what was used in the database, so a restart hands out nothing new', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    await reveal(a).expect(200);
    await reveal(a).expect(200);

    const [row] = await prisma.usageWindow.findMany({ where: { userId: await userIdFor(email) } });
    expect(row).toMatchObject({ action: 'showSolution', used: 2 });

    const usage = await a.get('/api/usage').expect(200);
    expect(usage.body.showSolution).toMatchObject({ used: 2, remaining: 1 });
  });

  it('opens a new window once the old one has ended', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    await prisma.usageWindow.create({
      data: {
        userId: await userIdFor(email),
        action: 'showSolution',
        windowStart: new Date(Date.now() - 25 * 60 * 60 * 1000),
        used: 3,
      },
    });

    const res = await reveal(a).expect(200);
    expect(res.body.usage.showSolution).toMatchObject({ used: 1, remaining: 2 });
  });

  it('gives the last unit to only one of two requests sent at once', async () => {
    const { email } = await createAuthenticatedAgent();
    const userId = await userIdFor(email);
    await hold(userId, 'showSolution', false);
    await hold(userId, 'showSolution', false);

    const results = await Promise.allSettled([
      hold(userId, 'showSolution', false),
      hold(userId, 'showSolution', false),
    ]);

    expect(results.map((r) => r.status).sort()).toEqual(['fulfilled', 'rejected']);
    const [row] = await prisma.usageWindow.findMany({ where: { userId } });
    expect(row.used).toBe(3);
  });

  it('never limits an admin, and stores nothing for one', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    const userId = await userIdFor(email);
    await prisma.user.update({ where: { id: userId }, data: { role: 'ADMIN' } });

    for (let i = 0; i < 4; i++) await reveal(a).expect(200);

    expect(await prisma.usageWindow.count({ where: { userId } })).toBe(0);
  });
});
