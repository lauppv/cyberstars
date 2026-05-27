import { describe, it, expect } from 'vitest';
import { agent, createAuthenticatedAgent } from './helpers.js';

describe('Auth flow', () => {
  it('signup → sets cookie → /me returns user', async () => {
    const a = agent();
    const res = await a
      .post('/auth/signup')
      .send({ name: 'Alice', email: 'alice@test.com', password: 'secret123' })
      .expect(200);

    expect(res.headers['set-cookie']).toBeDefined();

    const me = await a.get('/auth/me').expect(200);
    expect(me.body.name).toBe('Alice');
    expect(me.body.email).toBe('alice@test.com');
  });

  it('signup with duplicate email returns 409', async () => {
    await createAuthenticatedAgent({ email: 'dup@test.com' });

    const a = agent();
    await a
      .post('/auth/signup')
      .send({ name: 'Other', email: 'dup@test.com', password: 'secret123' })
      .expect(409);
  });

  it('signup with invalid data returns 400', async () => {
    const a = agent();
    await a.post('/auth/signup').send({ name: '', email: 'bad', password: '12' }).expect(400);
  });

  it('login with correct credentials returns cookie', async () => {
    await createAuthenticatedAgent({ email: 'bob@test.com', password: 'mypassword' });

    const a = agent();
    const res = await a
      .post('/auth/login')
      .send({ email: 'bob@test.com', password: 'mypassword' })
      .expect(200);

    expect(res.headers['set-cookie']).toBeDefined();

    const me = await a.get('/auth/me').expect(200);
    expect(me.body.email).toBe('bob@test.com');
  });

  it('login with wrong password returns 401', async () => {
    await createAuthenticatedAgent({ email: 'carol@test.com', password: 'correct' });

    await agent()
      .post('/auth/login')
      .send({ email: 'carol@test.com', password: 'wrong' })
      .expect(401);
  });

  it('login with nonexistent email returns 401', async () => {
    await agent()
      .post('/auth/login')
      .send({ email: 'nobody@test.com', password: 'anything' })
      .expect(401);
  });

  it('/auth/me without cookie returns 401', async () => {
    await agent().get('/auth/me').expect(401);
  });

  it('logout clears cookie', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    await a.get('/auth/me').expect(200);

    const res = await a.post('/auth/logout').expect(200);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toMatch(/token=;/);
  });

  it('protected routes return 401 after logout', async () => {
    const { agent: a } = await createAuthenticatedAgent();
    await a.post('/auth/logout').expect(200);

    await a.get('/auth/me').expect(401);
  });

  it('tampered token returns 403', async () => {
    const a = agent();
    await a.get('/auth/me').set('Cookie', 'token=invalid.jwt.token').expect(403);
  });

  it('forgot-password returns success even for nonexistent email', async () => {
    await agent().post('/auth/forgot-password').send({ email: 'ghost@test.com' }).expect(200);
  });

  it('reset-password with invalid code returns 400', async () => {
    await createAuthenticatedAgent({ email: 'resetme@test.com' });

    await agent()
      .post('/auth/reset-password')
      .send({ email: 'resetme@test.com', code: '000000', password: 'newpass123' })
      .expect(400);
  });

  it('multiple protected routes all require auth', async () => {
    const a = agent();
    await a.get('/api/progress/python').expect(401);
    await a.post('/api/support/tickets').send({}).expect(401);
    await a.patch('/api/profile').send({}).expect(401);
    await a.post('/api/forum/threads').send({}).expect(401);
  });
});
