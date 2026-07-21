import { describe, it, expect } from 'vitest';
import { agent, createAuthenticatedAgent, userIdFor } from './helpers.js';

// Open a fresh conversation between two new users and return their agents/ids
// plus the conversation id — the common setup for most cases below.
async function pair() {
  const { agent: a, email: emailA } = await createAuthenticatedAgent();
  const { agent: b, email: emailB } = await createAuthenticatedAgent();
  const idA = await userIdFor(emailA);
  const idB = await userIdFor(emailB);
  const open = await a.post('/api/messages/conversations').send({ recipientId: idB }).expect(201);
  return { a, b, idA, idB, conversationId: open.body.conversation.id as number };
}

describe('Messaging flow', () => {
  it('send → recipient sees it in the inbox with an unread count', async () => {
    const { a, b, conversationId } = await pair();

    await a
      .post(`/api/messages/conversations/${conversationId}`)
      .send({ content: 'hello' })
      .expect(201);

    const inbox = await b.get('/api/messages/conversations').expect(200);
    expect(inbox.body.conversations).toHaveLength(1);
    const convo = inbox.body.conversations[0];
    expect(convo.id).toBe(conversationId);
    expect(convo.lastMessage.content).toBe('hello');
    expect(convo.unreadCount).toBe(1);
  });

  it('history returns the messages for a participant', async () => {
    const { a, b, conversationId } = await pair();
    await a
      .post(`/api/messages/conversations/${conversationId}`)
      .send({ content: 'one' })
      .expect(201);
    await a
      .post(`/api/messages/conversations/${conversationId}`)
      .send({ content: 'two' })
      .expect(201);

    // History is newest-first (the client reverses it for display).
    const history = await b.get(`/api/messages/conversations/${conversationId}`).expect(200);
    expect(history.body.messages.map((m: { content: string }) => m.content)).toEqual([
      'two',
      'one',
    ]);
    expect(history.body.hasMore).toBe(false);
  });

  it('mark-read clears the recipient unread count', async () => {
    const { a, b, conversationId } = await pair();
    const sent = await a
      .post(`/api/messages/conversations/${conversationId}`)
      .send({ content: 'read me' })
      .expect(201);

    await b
      .post(`/api/messages/conversations/${conversationId}/read`)
      .send({ upToMessageId: sent.body.message.id })
      .expect(200);

    const inbox = await b.get('/api/messages/conversations').expect(200);
    expect(inbox.body.conversations[0].unreadCount).toBe(0);
  });

  it('reactions toggle on and off', async () => {
    const { a, b, idB, conversationId } = await pair();
    const sent = await a
      .post(`/api/messages/conversations/${conversationId}`)
      .send({ content: 'react to me' })
      .expect(201);
    const messageId = sent.body.message.id;

    const added = await b
      .post(`/api/messages/${messageId}/reactions`)
      .send({ emoji: '👍' })
      .expect(200);
    expect(added.body.message.reactions).toContainEqual({ emoji: '👍', userId: idB });

    const removed = await b
      .post(`/api/messages/${messageId}/reactions`)
      .send({ emoji: '👍' })
      .expect(200);
    expect(removed.body.message.reactions).toHaveLength(0);
  });

  it('sender can soft-delete their own message; reacting to it then fails', async () => {
    const { a, b, conversationId } = await pair();
    const sent = await a
      .post(`/api/messages/conversations/${conversationId}`)
      .send({ content: 'oops' })
      .expect(201);
    const messageId = sent.body.message.id;

    const deleted = await a.delete(`/api/messages/${messageId}`).expect(200);
    expect(deleted.body.message.deleted).toBe(true);
    expect(deleted.body.message.content).toBe('');

    await b.post(`/api/messages/${messageId}/reactions`).send({ emoji: '❤️' }).expect(400);
  });

  it('a non-participant cannot read history or send (404 hides existence)', async () => {
    const { conversationId } = await pair();
    const { agent: outsider } = await createAuthenticatedAgent();

    await outsider.get(`/api/messages/conversations/${conversationId}`).expect(404);
    await outsider
      .post(`/api/messages/conversations/${conversationId}`)
      .send({ content: 'intrusion' })
      .expect(404);
  });

  it('cannot open a conversation with yourself', async () => {
    const { agent: a, email } = await createAuthenticatedAgent();
    const id = await userIdFor(email);
    await a.post('/api/messages/conversations').send({ recipientId: id }).expect(400);
  });

  it('opening against an unknown user 404s', async () => {
    const { agent: a } = await createAuthenticatedAgent();
    await a.post('/api/messages/conversations').send({ recipientId: 999999 }).expect(404);
  });

  it('unauthenticated requests are rejected', async () => {
    await agent().get('/api/messages/conversations').expect(401);
  });
});
