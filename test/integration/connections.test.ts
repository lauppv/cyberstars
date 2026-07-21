import { describe, it, expect } from 'vitest';
import { agent, createAuthenticatedAgent, userIdFor } from './helpers.js';

// Two signed-up users plus B's numeric id — the target of most requests below.
async function twoUsers() {
  const { agent: a, email: emailA } = await createAuthenticatedAgent();
  const { agent: b, email: emailB } = await createAuthenticatedAgent();
  return { a, b, idA: await userIdFor(emailA), idB: await userIdFor(emailB) };
}

async function overview(who: ReturnType<typeof agent>) {
  const res = await who.get('/api/connections').expect(200);
  return res.body as {
    connections: { id: number; user: { id: number } }[];
    incoming: { id: number; user: { id: number } }[];
    outgoing: { id: number; user: { id: number } }[];
  };
}

describe('Connections flow', () => {
  it('send request → shows as outgoing for sender, incoming for addressee', async () => {
    const { a, b, idA, idB } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);

    const senderView = await overview(a);
    expect(senderView.outgoing).toHaveLength(1);
    expect(senderView.outgoing[0].user.id).toBe(idB);
    expect(senderView.incoming).toHaveLength(0);

    const addresseeView = await overview(b);
    expect(addresseeView.incoming).toHaveLength(1);
    expect(addresseeView.incoming[0].user.id).toBe(idA);
  });

  it('accept makes the connection mutual and clears the pending lists', async () => {
    const { a, b, idA, idB } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);
    const requestId = (await overview(b)).incoming[0].id;

    await b.post(`/api/connections/${requestId}/accept`).expect(200);

    const senderView = await overview(a);
    expect(senderView.connections.map((c) => c.user.id)).toEqual([idB]);
    expect(senderView.outgoing).toHaveLength(0);

    const addresseeView = await overview(b);
    expect(addresseeView.connections.map((c) => c.user.id)).toEqual([idA]);
    expect(addresseeView.incoming).toHaveLength(0);
  });

  it('decline drops the request without connecting', async () => {
    const { a, b, idB } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);
    const requestId = (await overview(b)).incoming[0].id;

    await b.post(`/api/connections/${requestId}/decline`).expect(200);

    expect((await overview(a)).outgoing).toHaveLength(0);
    const addresseeView = await overview(b);
    expect(addresseeView.incoming).toHaveLength(0);
    expect(addresseeView.connections).toHaveLength(0);
  });

  it('sender can cancel their own pending request', async () => {
    const { a, b, idB } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);
    const requestId = (await overview(a)).outgoing[0].id;

    await a.delete(`/api/connections/${requestId}`).expect(200);

    expect((await overview(a)).outgoing).toHaveLength(0);
    expect((await overview(b)).incoming).toHaveLength(0);
  });

  it('a reverse-direction request while one is pending is rejected (409)', async () => {
    const { a, b, idA, idB } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);
    // B → A must not coexist with the pending A → B.
    await b.post('/api/connections').send({ addresseeId: idA }).expect(409);
    // And a duplicate in the same direction is rejected too.
    await a.post('/api/connections').send({ addresseeId: idB }).expect(409);
  });

  it('cannot send a request to yourself', async () => {
    const { a, idA } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idA }).expect(400);
  });

  it('sending to an unknown user 404s', async () => {
    const { a } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: 999999 }).expect(404);
  });

  it('only the addressee can accept a request (requester gets 404)', async () => {
    const { a, b, idB } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);
    const requestId = (await overview(b)).incoming[0].id;
    // The requester trying to accept their own outgoing request is hidden as 404.
    await a.post(`/api/connections/${requestId}/accept`).expect(404);
  });

  it('unauthenticated requests are rejected', async () => {
    await agent().get('/api/connections').expect(401);
  });
});
