import { describe, it, expect } from 'vitest';
import { agent, createAuthenticatedAgent } from './helpers.js';

describe('Profile flow', () => {
  it('update bio → reflected in /auth/me', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    await a.patch('/api/profile').send({ bio: 'Hello world' }).expect(200);

    const me = await a.get('/auth/me').expect(200);
    expect(me.body.bio).toBe('Hello world');
  });

  it('update status → reflected in /auth/me with expiry', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    await a.patch('/api/profile').send({ status: 'coding' }).expect(200);

    const me = await a.get('/auth/me').expect(200);
    expect(me.body.status).toBe('coding');
    expect(me.body.statusExpiresAt).toBeDefined();
  });

  it('clear status by sending empty string', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    await a.patch('/api/profile').send({ status: 'busy' }).expect(200);
    await a.patch('/api/profile').send({ status: '' }).expect(200);

    const me = await a.get('/auth/me').expect(200);
    expect(me.body.status).toBeNull();
  });

  it('unauthenticated user cannot update profile', async () => {
    await agent().patch('/api/profile').send({ bio: 'Nope' }).expect(401);
  });
});
