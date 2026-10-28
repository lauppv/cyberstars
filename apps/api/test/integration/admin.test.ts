import { describe, it, expect, beforeEach } from 'vitest';
import { agent, createAuthenticatedAgent, userIdFor } from './helpers.js';
import { prisma } from '../../src/config/db.js';
import { clearCache } from '../../src/services/admin.service.js';

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

describe('Admin announcements', () => {
  it('a regular USER is forbidden (403)', async () => {
    const { agent: user } = await createAuthenticatedAgent();
    await user.post('/api/admin/announcements').send({ text: 'Hi' }).expect(403);
    expect(await prisma.notification.count()).toBe(0);
  });

  it('a MODERATOR is forbidden too, only admins and the founder send one', async () => {
    const { agent: mod, email } = await createAuthenticatedAgent();
    await prisma.user.update({
      where: { id: await userIdFor(email) },
      data: { role: 'MODERATOR' },
    });
    await mod.post('/api/admin/announcements').send({ text: 'Hi' }).expect(403);
  });

  it("lands in every bell but the sender's, the text trimmed", async () => {
    const { agent: user, email } = await createAuthenticatedAgent();
    const a = await admin();
    const res = await a
      .post('/api/admin/announcements')
      .send({ text: '  A new course is out.\nGo try it.  ' })
      .expect(201);
    // The sentinel ADMIN and the user above, not the sender
    expect(res.body).toEqual({ sent: 2 });

    const { body } = await user.get('/api/notifications').expect(200);
    expect(body.unreadCount).toBe(1);
    const [kept] = await prisma.announcement.findMany();
    expect(kept.text).toBe('A new course is out.\nGo try it.');
    expect(body.items[0]).toMatchObject({
      type: 'ANNOUNCEMENT',
      entityId: kept.id,
      data: { text: 'A new course is out.\nGo try it.' },
      actor: { name: expect.any(String) },
    });
    const own = await a.get('/api/notifications').expect(200);
    expect(own.body.items).toEqual([]);

    const rows = await prisma.notification.findMany({ where: { type: 'ANNOUNCEMENT' } });
    expect(rows.map((r) => r.userId)).toContain(await userIdFor(email));
  });

  it('refuses an empty one', async () => {
    const a = await admin();
    await a.post('/api/admin/announcements').send({ text: '   ' }).expect(400);
    expect(await prisma.notification.count()).toBe(0);
    expect(await prisma.announcement.count()).toBe(0);
  });

  it('lists the ones sent, newest first, with who sent them', async () => {
    const a = await admin();
    await a.post('/api/admin/announcements').send({ text: 'First' }).expect(201);
    await a.post('/api/admin/announcements').send({ text: 'Second' }).expect(201);
    const { body } = await a.get('/api/admin/announcements').expect(200);
    expect(body).toMatchObject([
      { text: 'Second', authorName: expect.any(String), createdAt: expect.any(String) },
      { text: 'First', authorName: expect.any(String) },
    ]);
  });

  it('keeps the history from everyone but admins', async () => {
    const { agent: user } = await createAuthenticatedAgent();
    await user.get('/api/admin/announcements').expect(403);
  });

  it('refuses one past the length limit', async () => {
    const a = await admin();
    await a
      .post('/api/admin/announcements')
      .send({ text: 'x'.repeat(2001) })
      .expect(400);
  });
});
