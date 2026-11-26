import { describe, it, expect, beforeEach } from 'vitest';
import { agent, createAuthenticatedAgent, userIdFor } from './helpers.js';
import { prisma } from '../../src/config/db.js';
import { clearCache } from '../../src/services/admin.service.js';
import { clearUserSockets, registerUserSocket } from '../../src/services/ws-user.js';
import type { WebSocket } from 'ws';

// Promote a freshly signed-up user to ADMIN. The session holds no role: it is
// read from the DB on every request, so the same cookie now passes
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
    expect(body.tutor).toEqual({
      promptsLast7Days: expect.any(Number),
      promptsLast30Days: expect.any(Number),
    });
    expect(body.users).toEqual({
      total: expect.any(Number),
      newLast7Days: expect.any(Number),
      newLast30Days: expect.any(Number),
    });
    expect(body.progress).toMatchObject({
      totalCompletions: expect.any(Number),
      byCourse: expect.any(Array),
      topLessons: expect.any(Array),
    });
    expect(body.forum).toBeUndefined();
    expect(body.support).toBeUndefined();
    expect(body.codeExec).toMatchObject({
      activeContainers: expect.any(Number),
      busySlots: expect.any(Number),
    });
    expect(typeof body.generatedAt).toBe('string');
  });

  it('counts students only, no moderators, admins, founder or test accounts', async () => {
    const a = await admin();
    for (const role of ['MODERATOR', 'FOUNDER'] as const) {
      const id = await userIdFor((await createAuthenticatedAgent()).email);
      await prisma.user.update({ where: { id }, data: { role } });
    }
    await createAuthenticatedAgent({ email: 'kaizen@fake.com' });
    await createAuthenticatedAgent({ email: 'aym@proton.fake.com' });
    await createAuthenticatedAgent({ email: 'hogs@bots.cyberstars.app' });
    await createAuthenticatedAgent();
    const res = await a.get('/api/admin/stats').expect(200);
    // Of the sentinel ADMIN, the promoted admin, a moderator, the founder, 3
    // bots and 1 real student, only the student
    expect(res.body.users).toEqual({ total: 1, newLast7Days: 1, newLast30Days: 1 });
  });

  it("counts students' completed lessons only", async () => {
    const a = await admin();
    const student = await userIdFor((await createAuthenticatedAgent()).email);
    const bot = await userIdFor((await createAuthenticatedAgent({ email: 'x@fake.com' })).email);
    const staff = await userIdFor((await createAuthenticatedAgent()).email);
    await prisma.user.update({ where: { id: staff }, data: { role: 'MODERATOR' } });
    await prisma.userLessonProgress.createMany({
      data: [student, bot, staff].map((userId) => ({
        userId,
        courseKey: 'python',
        lessonSlug: 'print',
        completed: true,
      })),
    });
    const res = await a.get('/api/admin/stats').expect(200);
    expect(res.body.progress.totalCompletions).toBe(1);
    expect(res.body.progress.byCourse).toEqual([
      { courseKey: 'python', completions: 1, learners: 1 },
    ]);
  });

  it('counts the students signed in online, no one else', async () => {
    const a = await admin();
    const student = await userIdFor((await createAuthenticatedAgent()).email);
    const founder = await userIdFor((await createAuthenticatedAgent()).email);
    await prisma.user.update({ where: { id: founder }, data: { role: 'FOUNDER' } });
    const bot = await userIdFor((await createAuthenticatedAgent({ email: 'y@fake.com' })).email);
    registerUserSocket(student, {} as WebSocket);
    registerUserSocket(founder, {} as WebSocket);
    registerUserSocket(bot, {} as WebSocket);
    try {
      const res = await a.get('/api/admin/stats').expect(200);
      expect(res.body.online.users).toBe(1);
    } finally {
      clearUserSockets();
    }
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
    // The sentinel ADMIN and the user above, not the sender, get it in their
    // bell; only the user counts, the admin isn't a student
    expect(res.body).toEqual({ sent: 1 });
    expect(await prisma.notification.count({ where: { type: 'ANNOUNCEMENT' } })).toBe(2);

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

  it('counts students only among those who got it and who clicked it', async () => {
    const { agent: ana } = await createAuthenticatedAgent();
    const { agent: mod, email } = await createAuthenticatedAgent();
    await prisma.user.update({
      where: { id: await userIdFor(email) },
      data: { role: 'MODERATOR' },
    });
    const { agent: bot } = await createAuthenticatedAgent({ email: 'w@fake.com' });
    const a = await admin();
    // Ana, the moderator, the bot and the sentinel ADMIN get it, only Ana counts
    const res = await a.post('/api/admin/announcements').send({ text: 'Hi' }).expect(201);
    expect(res.body).toEqual({ sent: 1 });
    expect(await prisma.notification.count()).toBe(4);
    for (const who of [ana, mod, bot]) {
      const { body } = await who.get('/api/notifications').expect(200);
      await who.post(`/api/notifications/${body.items[0].id}/opened`).expect(204);
    }
    const [kept] = (await a.get('/api/admin/announcements').expect(200)).body;
    expect(kept.opens).toEqual({ openers: 1, recipients: 1 });
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
