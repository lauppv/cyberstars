import { describe, it, expect } from 'vitest';
import { createAuthenticatedAgent, userIdFor } from './helpers.js';
import { prisma } from '../../src/config/db.js';

async function admin() {
  const { agent: a, email } = await createAuthenticatedAgent();
  const id = await userIdFor(email);
  await prisma.user.update({ where: { id }, data: { role: 'ADMIN' } });
  return a;
}

describe('Admin polls', () => {
  it('a regular USER is forbidden (403)', async () => {
    const { agent: user } = await createAuthenticatedAgent();
    await user
      .post('/api/admin/polls')
      .send({ question: 'Hi?', options: ['Yes', 'No'] })
      .expect(403);
    await user.get('/api/admin/polls').expect(403);
    expect(await prisma.poll.count()).toBe(0);
  });

  it("lands in every bell but the sender's, the question and options trimmed", async () => {
    const { agent: user, email } = await createAuthenticatedAgent();
    const a = await admin();
    const res = await a
      .post('/api/admin/polls')
      .send({ question: '  Which course next?  ', options: [' Rust ', 'Go'] })
      .expect(201);
    // The sentinel ADMIN and the user above, not the sender
    expect(res.body).toEqual({ sent: 2 });

    const poll = await prisma.poll.findFirstOrThrow({ include: { options: true } });
    expect(poll).toMatchObject({ question: 'Which course next?', recipients: 2, voters: 0 });
    expect(poll.options.map((o) => o.text)).toEqual(['Rust', 'Go']);

    const { body } = await user.get('/api/notifications').expect(200);
    expect(body.unreadCount).toBe(1);
    expect(body.items[0]).toMatchObject({
      type: 'POLL',
      entityId: poll.id,
      data: { text: 'Which course next?' },
    });
    expect((await a.get('/api/notifications').expect(200)).body.items).toEqual([]);
    const rows = await prisma.notification.findMany({ where: { type: 'POLL' } });
    expect(rows.map((r) => r.userId)).toContain(await userIdFor(email));
  });

  it('refuses a poll without a question, with fewer than 2 options, an empty one or one twice', async () => {
    const a = await admin();
    for (const body of [
      { question: '  ', options: ['Yes', 'No'] },
      { question: 'Hi?', options: ['Yes'] },
      { question: 'Hi?', options: ['Yes', '  '] },
      { question: 'Hi?', options: ['Yes', ' Yes'] },
      { question: 'Hi?', options: Array.from({ length: 11 }, (_, i) => `O${i}`) },
      { question: 'x'.repeat(301), options: ['Yes', 'No'] },
      { question: 'Hi?', options: ['Yes', 'x'.repeat(201)] },
    ]) {
      await a.post('/api/admin/polls').send(body).expect(400);
    }
    expect(await prisma.poll.count()).toBe(0);
    expect(await prisma.notification.count()).toBe(0);
  });

  it('lists the ones sent, newest first, with who sent them and the counts', async () => {
    const a = await admin();
    await a
      .post('/api/admin/polls')
      .send({ question: 'First?', options: ['Yes', 'No'] })
      .expect(201);
    await a
      .post('/api/admin/polls')
      .send({ question: 'Second?', options: ['A', 'B'] })
      .expect(201);
    const { body } = await a.get('/api/admin/polls').expect(200);
    expect(body).toMatchObject([
      {
        question: 'Second?',
        authorName: expect.any(String),
        recipients: 1,
        voters: 0,
        options: [
          { text: 'A', votes: 0 },
          { text: 'B', votes: 0 },
        ],
      },
      { question: 'First?' },
    ]);
  });
});
