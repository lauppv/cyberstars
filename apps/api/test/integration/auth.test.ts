import { describe, it, expect, vi, afterEach } from 'vitest';
import { prisma } from '../../src/config/db.js';
import { config } from '../../src/config/index.js';
import { agent, createAuthenticatedAgent } from './helpers.js';

async function resetCodeOf(email: string): Promise<string | null> {
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  return user.resetCode;
}

function tryReset(email: string, code: string, password = 'newpass123') {
  return agent().post('/auth/reset-password').send({ email, code, password });
}

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
    // A new account starts held on the first-lesson tour.
    expect(me.body.onboardedAt).toBeNull();
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
    expect(res.headers['set-cookie'][0]).toMatch(/^session=;/);
  });

  it('protected routes return 401 after logout', async () => {
    const { agent: a } = await createAuthenticatedAgent();
    await a.post('/auth/logout').expect(200);

    await a.get('/auth/me').expect(401);
  });

  it('tampered token returns 403', async () => {
    const a = agent();
    await a.get('/auth/me').set('Cookie', 'session=invalid.token').expect(403);
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

  it('resets the password with the right code on the first try', async () => {
    await createAuthenticatedAgent({ email: 'right@test.com' });
    await agent().post('/auth/forgot-password').send({ email: 'right@test.com' }).expect(200);

    await tryReset('right@test.com', (await resetCodeOf('right@test.com'))!).expect(200);
    await agent()
      .post('/auth/login')
      .send({ email: 'right@test.com', password: 'newpass123' })
      .expect(200);
  });

  it('refuses the right code after five wrong ones, until a new code is asked for', async () => {
    await createAuthenticatedAgent({ email: 'locked@test.com' });
    await agent().post('/auth/forgot-password').send({ email: 'locked@test.com' }).expect(200);
    const code = (await resetCodeOf('locked@test.com'))!;
    const wrong = code === '000000' ? '111111' : '000000';

    for (let i = 0; i < 5; i++) {
      const res = await tryReset('locked@test.com', wrong).expect(400);
      expect(res.body.error).toBe('Invalid or expired code');
    }
    const res = await tryReset('locked@test.com', code).expect(400);
    expect(res.body.error).toBe('This code has expired or used up its attempts, ask for a new one');

    await agent().post('/auth/forgot-password').send({ email: 'locked@test.com' }).expect(200);
    await tryReset('locked@test.com', (await resetCodeOf('locked@test.com'))!).expect(200);
  });

  it('takes the right code as the fifth try', async () => {
    await createAuthenticatedAgent({ email: 'fifth@test.com' });
    await agent().post('/auth/forgot-password').send({ email: 'fifth@test.com' }).expect(200);
    const code = (await resetCodeOf('fifth@test.com'))!;
    const wrong = code === '000000' ? '111111' : '000000';

    for (let i = 0; i < 4; i++) await tryReset('fifth@test.com', wrong).expect(400);
    await tryReset('fifth@test.com', code).expect(200);
  });

  it('gives one email three codes an hour, with or without an account', async () => {
    await createAuthenticatedAgent({ email: 'many@test.com' });
    for (const email of ['many@test.com', 'nobody@test.com']) {
      for (let i = 0; i < 3; i++) {
        await agent().post('/auth/forgot-password').send({ email }).expect(200);
      }
    }
    const third = await resetCodeOf('many@test.com');

    for (const email of ['many@test.com', 'nobody@test.com']) {
      const res = await agent().post('/auth/forgot-password').send({ email }).expect(429);
      expect(res.body.error).toBe('Too many codes asked for this email, try again later');
    }
    // the refused request made no new code, so it sent no email
    expect(await resetCodeOf('many@test.com')).toBe(third);
    // another email still gets its codes
    await agent().post('/auth/forgot-password').send({ email: 'other@test.com' }).expect(200);
  });

  it('multiple protected routes all require auth', async () => {
    const a = agent();
    await a.get('/api/progress/python').expect(401);
    await a.post('/api/support/tickets').send({}).expect(401);
    await a.patch('/api/profile').send({}).expect(401);
    await a.post('/api/forum/threads').send({}).expect(401);
  });
});

// Without a Resend key the email service logs each email; the link is in it
async function confirmTokenSentTo(email: string): Promise<string> {
  let token = '';
  await vi.waitFor(() => {
    const line = log.mock.calls
      .map((call) => String(call[0]))
      .filter((text) => text.includes(`Email to ${email} `) && text.includes('confirm-email'))
      .at(-1);
    token = /token=([\w-]{43})/.exec(line ?? '')?.[1] ?? '';
    expect(token).not.toBe('');
  });
  return token;
}

const log = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('Email case and confirmation (CYB-135)', () => {
  afterEach(() => {
    Object.assign(config, { founderEmail: '' });
  });

  it("keeps a case variant of the founder's email from making a second account or a founder", async () => {
    Object.assign(config, { founderEmail: 'boss@test.com' });
    await createAuthenticatedAgent({ email: 'boss@test.com' });
    await agent()
      .post('/auth/signup')
      .send({ name: 'Intruder', email: 'Boss@Test.com', password: 'secret123' })
      .expect(409);
    const founders = await prisma.user.findMany({ where: { role: 'FOUNDER' } });
    expect(founders).toHaveLength(0);
  });

  it("makes the founder's account FOUNDER once its link is opened", async () => {
    Object.assign(config, { founderEmail: 'Owner@Test.com' });
    const { agent: owner } = await createAuthenticatedAgent({ email: 'owner@test.com' });
    const before = await owner.get('/auth/me').expect(200);
    expect(before.body).toMatchObject({ emailConfirmed: false, confirmLinkSent: true });
    expect(before.body.role).not.toBe('FOUNDER');

    const token = await confirmTokenSentTo('owner@test.com');
    await agent().post('/auth/confirm-email').send({ token }).expect(200);
    await agent().post('/auth/confirm-email').send({ token }).expect(400);

    const after = await owner.get('/auth/me').expect(200);
    expect(after.body).toMatchObject({ emailConfirmed: true, role: 'FOUNDER' });
  });

  it('signs in and resets the password whatever case the email is typed in', async () => {
    await createAuthenticatedAgent({ email: 'Mixed@Test.com', password: 'secret123' });
    await userWithEmail('mixed@test.com');
    await agent()
      .post('/auth/login')
      .send({ email: 'MIXED@test.com', password: 'secret123' })
      .expect(200);
    await agent().post('/auth/forgot-password').send({ email: 'mixed@TEST.com' }).expect(200);
    const code = (await resetCodeOf('mixed@test.com'))!;
    await tryReset('Mixed@test.com', code).expect(200);
    const user = await userWithEmail('mixed@test.com');
    expect(user.emailConfirmedAt).not.toBeNull();
  });

  it('refuses an email with capitals in the database itself', async () => {
    const { email } = await createAuthenticatedAgent({ email: 'lower@test.com' });
    await expect(
      prisma.user.update({ where: { email }, data: { email: 'Lower@test.com' } }),
    ).rejects.toThrow(/users_email_lowercase/);
  });
});

async function userWithEmail(email: string) {
  return prisma.user.findUniqueOrThrow({ where: { email } });
}
