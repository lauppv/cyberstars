import { describe, it, expect } from 'vitest';
import { agent, createAuthenticatedAgent, userIdFor } from './helpers.js';
import { prisma } from '../../src/config/db.js';

async function admin() {
  const { agent: a, email } = await createAuthenticatedAgent();
  const id = await userIdFor(email);
  await prisma.user.update({ where: { id }, data: { role: 'ADMIN' } });
  return a;
}

// A poll sent by a fresh admin, and its id
async function sendPoll(options = ['Rust', 'Go', 'SQL']) {
  const a = await admin();
  await a.post('/api/admin/polls').send({ question: 'Which course next?', options }).expect(201);
  const poll = await prisma.poll.findFirstOrThrow({ include: { options: true } });
  return { admin: a, poll };
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

describe('Voting in a poll', () => {
  it('keeps guests out', async () => {
    const { poll } = await sendPoll();
    await agent().get(`/api/polls/${poll.id}`).expect(401);
    await agent()
      .post(`/api/polls/${poll.id}/vote`)
      .send({ optionIds: [poll.options[0].id] })
      .expect(401);
  });

  it('shows a student the question and options, no counts, and whether they voted', async () => {
    const { agent: user } = await createAuthenticatedAgent();
    const { poll } = await sendPoll();
    const { body } = await user.get(`/api/polls/${poll.id}`).expect(200);
    expect(body).toEqual({
      id: poll.id,
      question: 'Which course next?',
      options: poll.options.map((o) => ({ id: o.id, text: o.text })),
      voted: false,
    });
  });

  it('counts a vote once, with every option picked, and never says who picked what', async () => {
    const { agent: ana, email } = await createAuthenticatedAgent();
    const { agent: bob } = await createAuthenticatedAgent();
    const { admin: a, poll } = await sendPoll();
    const [rust, go, sql] = poll.options;

    await ana
      .post(`/api/polls/${poll.id}/vote`)
      .send({ optionIds: [rust.id, sql.id] })
      .expect(204);
    await bob
      .post(`/api/polls/${poll.id}/vote`)
      .send({ optionIds: [rust.id] })
      .expect(204);
    await ana
      .post(`/api/polls/${poll.id}/vote`)
      .send({ optionIds: [go.id] })
      .expect(409);

    expect((await ana.get(`/api/polls/${poll.id}`).expect(200)).body.voted).toBe(true);
    const [results] = (await a.get('/api/admin/polls').expect(200)).body;
    expect(results.voters).toBe(2);
    expect(results.options.map((o: { votes: number }) => o.votes)).toEqual([2, 0, 1]);

    // Who voted is kept, never next to what they picked
    const voters = await prisma.pollVoter.findMany();
    expect(voters).toEqual(
      expect.arrayContaining([{ pollId: poll.id, userId: await userIdFor(email) }]),
    );
    expect(Object.keys(voters[0]).sort()).toEqual(['pollId', 'userId']);
  });

  it("keeps the counts once a voter's account is gone", async () => {
    const { agent: user, email } = await createAuthenticatedAgent();
    const { admin: a, poll } = await sendPoll();
    await user
      .post(`/api/polls/${poll.id}/vote`)
      .send({ optionIds: [poll.options[1].id] })
      .expect(204);
    await prisma.user.delete({ where: { id: await userIdFor(email) } });

    const [results] = (await a.get('/api/admin/polls').expect(200)).body;
    expect(results.voters).toBe(1);
    expect(results.options[1].votes).toBe(1);
    expect(await prisma.pollVoter.count()).toBe(0);
  });

  it("refuses no option, another poll's option and a poll that doesn't exist", async () => {
    const { agent: user } = await createAuthenticatedAgent();
    const { poll } = await sendPoll();
    await user.post(`/api/polls/${poll.id}/vote`).send({ optionIds: [] }).expect(400);
    await user
      .post(`/api/polls/${poll.id}/vote`)
      .send({ optionIds: [poll.options[0].id + 100] })
      .expect(400);
    await user
      .post(`/api/polls/${poll.id + 100}/vote`)
      .send({ optionIds: [poll.options[0].id] })
      .expect(404);
    await user.get(`/api/polls/${poll.id + 100}`).expect(404);
    await user.get('/api/polls/abc').expect(400);
    expect(await prisma.pollVoter.count()).toBe(0);
  });

  it("is a 404 for its author and an account made after it went out, so they can't vote", async () => {
    const { admin: a, poll } = await sendPoll();
    const { agent: late } = await createAuthenticatedAgent();
    for (const who of [a, late]) {
      await who.get(`/api/polls/${poll.id}`).expect(404);
      await who
        .post(`/api/polls/${poll.id}/vote`)
        .send({ optionIds: [poll.options[0].id] })
        .expect(404);
    }
    expect(await prisma.pollVoter.count()).toBe(0);
    const [results] = (await a.get('/api/admin/polls').expect(200)).body;
    expect(results).toMatchObject({ recipients: 1, voters: 0 });
  });

  it('takes an answer under Other, kept with no voter, and lists it for the admin only', async () => {
    const { agent: ana } = await createAuthenticatedAgent();
    const { agent: bob } = await createAuthenticatedAgent();
    const a = await admin();
    await a
      .post('/api/admin/polls')
      .send({ question: 'What gets in your way?', options: ['Too hard', 'Too easy'], other: true })
      .expect(201);
    const poll = await prisma.poll.findFirstOrThrow({
      include: { options: { orderBy: { id: 'asc' } } },
    });
    const [hard, , write] = poll.options;
    expect(write).toMatchObject({ text: 'Other', writeIn: true });

    const { body } = await ana.get(`/api/polls/${poll.id}`).expect(200);
    expect(body.options.map((o: { writeIn: boolean }) => o.writeIn)).toEqual([false, false, true]);
    expect(body).not.toHaveProperty('answers');

    const url = `/api/polls/${poll.id}/vote`;
    await ana
      .post(url)
      .send({ optionIds: [write.id] })
      .expect(400);
    await ana
      .post(url)
      .send({ optionIds: [hard.id], answer: 'More C' })
      .expect(400);
    await ana
      .post(url)
      .send({ optionIds: [write.id], answer: '   ' })
      .expect(400);
    await ana
      .post(url)
      .send({ optionIds: [write.id], answer: 'x'.repeat(501) })
      .expect(400);
    await ana
      .post(url)
      .send({ optionIds: [hard.id, write.id], answer: '  Not enough time  ' })
      .expect(204);
    await bob
      .post(url)
      .send({ optionIds: [write.id], answer: 'The tests' })
      .expect(204);

    const [results] = (await a.get('/api/admin/polls').expect(200)).body;
    expect(results.voters).toBe(2);
    expect(results.options.map((o: { votes: number }) => o.votes)).toEqual([1, 0, 2]);
    expect(results.answers).toEqual(['The tests', 'Not enough time']);
    // Nothing ties an answer to who wrote it
    const rows = await prisma.pollAnswer.findMany();
    expect(Object.keys(rows[0]).sort()).toEqual(['id', 'pollId', 'text']);
  });
});
