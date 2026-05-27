import { describe, it, expect } from 'vitest';
import { agent, createAuthenticatedAgent } from './helpers.js';

describe('Support flow', () => {
  it('create ticket → get my tickets → includes it', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    await a
      .post('/api/support/tickets')
      .send({ type: 'BUG', subject: 'App crashes', message: 'When I click run...' })
      .expect(201);

    const mine = await a.get('/api/support/tickets/mine').expect(200);
    expect(mine.body.length).toBe(1);
    expect(mine.body[0].subject).toBe('App crashes');
    expect(mine.body[0].status).toBe('OPEN');
  });

  it('add message to ticket → get messages', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    const ticket = await a
      .post('/api/support/tickets')
      .send({ type: 'QUESTION', subject: 'How to?', message: 'First message' })
      .expect(201);

    const ticketId = ticket.body.ticketId;

    await a
      .post(`/api/support/tickets/${ticketId}/messages`)
      .send({ message: 'Follow up question' })
      .expect(201);

    const messages = await a.get(`/api/support/tickets/${ticketId}/messages`).expect(200);
    expect(messages.body.length).toBe(1);
    expect(messages.body[0].message).toBe('Follow up question');
  });

  it('user can close own ticket', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    const ticket = await a
      .post('/api/support/tickets')
      .send({ type: 'FEEDBACK', subject: 'Nice app', message: 'Love it' })
      .expect(201);

    await a
      .put(`/api/support/tickets/${ticket.body.ticketId}/status`)
      .send({ status: 'CLOSED' })
      .expect(200);

    const mine = await a.get('/api/support/tickets/mine').expect(200);
    expect(mine.body[0].status).toBe('CLOSED');
  });

  it('unauthenticated user cannot create ticket', async () => {
    await agent()
      .post('/api/support/tickets')
      .send({ type: 'BUG', subject: 'No auth', message: 'Should fail' })
      .expect(401);
  });

  it('user cannot set status other than CLOSED on own ticket', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    const ticket = await a
      .post('/api/support/tickets')
      .send({ type: 'BUG', subject: 'Test', message: 'Msg' })
      .expect(201);

    await a
      .put(`/api/support/tickets/${ticket.body.ticketId}/status`)
      .send({ status: 'IN_PROGRESS' })
      .expect(403);
  });

  it('user cannot view another user ticket messages', async () => {
    const { agent: owner } = await createAuthenticatedAgent();
    const { agent: other } = await createAuthenticatedAgent();

    const ticket = await owner
      .post('/api/support/tickets')
      .send({ type: 'BUG', subject: 'Private', message: 'Secret' })
      .expect(201);

    await other.get(`/api/support/tickets/${ticket.body.ticketId}/messages`).expect(403);
  });

  it('user cannot add message to another user ticket', async () => {
    const { agent: owner } = await createAuthenticatedAgent();
    const { agent: other } = await createAuthenticatedAgent();

    const ticket = await owner
      .post('/api/support/tickets')
      .send({ type: 'QUESTION', subject: 'Mine', message: 'My ticket' })
      .expect(201);

    await other
      .post(`/api/support/tickets/${ticket.body.ticketId}/messages`)
      .send({ message: 'Intrusion' })
      .expect(403);
  });
});
