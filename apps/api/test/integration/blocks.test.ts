import { describe, it, expect } from 'vitest';
import { createAuthenticatedAgent, userIdFor } from './helpers.js';
import { prisma } from '../../src/config/db.js';

async function twoUsers() {
  const { agent: a, email: emailA } = await createAuthenticatedAgent();
  const { agent: b, email: emailB } = await createAuthenticatedAgent();
  return { a, b, idA: await userIdFor(emailA), idB: await userIdFor(emailB) };
}

describe('Blocks', () => {
  it('takes two blocks of the same person at once, as from two tabs', async () => {
    const { a, idA, idB } = await twoUsers();
    const answers = await Promise.all([
      a.put(`/api/blocks/${idB}`),
      a.put(`/api/blocks/${idB}`),
      a.put(`/api/blocks/${idB}`),
    ]);
    expect(answers.map((r) => r.status)).toEqual([200, 200, 200]);
    expect(await prisma.userBlock.count({ where: { blockerId: idA, blockedId: idB } })).toBe(1);
  });

  it('ends a pending request and refuses new ones either way', async () => {
    const { a, b, idA, idB } = await twoUsers();
    await b.post('/api/connections').send({ addresseeId: idA }).expect(201);
    await a.put(`/api/blocks/${idB}`).expect(200);

    expect(await prisma.connection.count({ where: { requesterId: idB } })).toBe(0);
    await b.post('/api/connections').send({ addresseeId: idA }).expect(403);
    await a.post('/api/connections').send({ addresseeId: idB }).expect(403);
  });
});
