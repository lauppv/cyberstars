import { describe, it, expect, beforeEach } from 'vitest';
import { agent, createAuthenticatedAgent, userIdFor } from './helpers.js';
import { prisma } from '../../server/config/db.js';
import { clearCache } from '../../server/services/admin.service.js';

// Promote a freshly signed-up user to ADMIN. The JWT carries only { id } and the
// role is read from the DB on every request, so the same cookie now passes
// requireAdmin without re-authenticating.
async function admin() {
  const { agent: a, email } = await createAuthenticatedAgent();
  const id = await userIdFor(email);
  await prisma.user.update({ where: { id }, data: { role: 'ADMIN' } });
  return a;
}

describe('Admin stats', () => {
  beforeEach(() => {
    // The service caches aggregates; drop it so each test recomputes fresh.
    clearCache();
  });

  it('a regular USER is forbidden (403)', async () => {
    const { agent: user } = await createAuthenticatedAgent();
    await user.get('/api/admin/stats').expect(403);
  });

  it('an ADMIN gets the full stats shape', async () => {
    const a = await admin();
    const res = await a.get('/api/admin/stats').expect(200);

    const body = res.body;
    expect(body.users).toMatchObject({ total: expect.any(Number), byRole: expect.any(Object) });
    expect(body.progress).toMatchObject({
      totalCompletions: expect.any(Number),
      byCourse: expect.any(Array),
      topLessons: expect.any(Array),
    });
    expect(body.forum).toMatchObject({
      threads: expect.any(Number),
      posts: expect.any(Number),
      reactions: expect.any(Number),
    });
    expect(body.support).toMatchObject({ total: expect.any(Number), byStatus: expect.any(Object) });
    expect(body.codeExec).toMatchObject({
      activeContainers: expect.any(Number),
      runningNow: expect.any(Number),
    });
    expect(typeof body.generatedAt).toBe('string');
  });

  it('user counts reflect the signed-up accounts', async () => {
    const a = await admin();
    const res = await a.get('/api/admin/stats').expect(200);
    // Sentinel ADMIN + the promoted admin above = 2 users, one of them ADMIN.
    expect(res.body.users.total).toBe(2);
    expect(res.body.users.byRole.ADMIN).toBe(2);
  });

  it('?fresh=1 recomputes past a stale cache', async () => {
    const a = await admin();
    const first = await a.get('/api/admin/stats').expect(200);

    // A new signup would be masked by the cache; ?fresh=1 must pick it up.
    await createAuthenticatedAgent();
    const cached = await a.get('/api/admin/stats').expect(200);
    expect(cached.body.users.total).toBe(first.body.users.total);

    const fresh = await a.get('/api/admin/stats?fresh=1').expect(200);
    expect(fresh.body.users.total).toBe(first.body.users.total + 1);
  });

  it('unauthenticated requests are rejected', async () => {
    await agent().get('/api/admin/stats').expect(401);
  });
});
