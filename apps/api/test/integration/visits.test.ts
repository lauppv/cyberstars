import { describe, it, expect } from 'vitest';
import { agent, createAuthenticatedAgent, userIdFor } from './helpers.js';
import { prisma } from '../../src/config/db.js';
import { rollUp, today } from '../../src/services/visits.service.js';

const BROWSER = 'Mozilla/5.0 (X11; Linux x86_64) Firefox/131.0';

async function admin() {
  const { agent: a, email } = await createAuthenticatedAgent();
  const id = await userIdFor(email);
  await prisma.user.update({ where: { id }, data: { role: 'ADMIN' } });
  return a;
}

function visit(a: ReturnType<typeof agent>, body: object, ua = BROWSER) {
  return a.post('/api/visits').set('User-Agent', ua).send(body).expect(204);
}

const asDate = (day: string) => new Date(`${day}T00:00:00Z`);

describe('Visitor counts', () => {
  it('a few pages from one browser are one visitor, with its pages and where it came from', async () => {
    const guest = agent();
    await visit(guest, { path: '/', referrer: 'www.reddit.com' });
    await visit(guest, { path: '/courses' });
    await visit(guest, { path: '/ro/courses' });

    const res = await (await admin()).get('/api/admin/visits').expect(200);
    const day = res.body.days.at(-1);
    expect(day).toMatchObject({ day: today(), visitors: 1, views: 3 });
    expect(res.body.pages).toEqual([
      { key: '/courses', visitors: 1, views: 2 },
      { key: '/', visitors: 1, views: 1 },
    ]);
    expect(res.body.sources).toEqual([{ key: 'reddit', visitors: 1, views: 1 }]);
    expect(res.body.auth).toEqual([{ key: 'guest', visitors: 1, views: 3 }]);
    expect(res.body.lang).toEqual(
      expect.arrayContaining([
        { key: 'en', visitors: 1, views: 2 },
        { key: 'ro', visitors: 1, views: 1 },
      ]),
    );
  });

  it('counts a signed-in student as signed in, and leaves bots out', async () => {
    const { agent: student } = await createAuthenticatedAgent();
    await visit(student, { path: '/lesson/python/print' });
    await visit(agent(), { path: '/' }, 'Mozilla/5.0 (compatible; Googlebot/2.1)');

    const res = await (await admin()).get('/api/admin/visits').expect(200);
    expect(res.body.auth).toEqual([{ key: 'signedIn', visitors: 1, views: 1 }]);
    expect(await prisma.pageVisit.count()).toBe(1);
  });

  it('only an admin sees the numbers', async () => {
    const { agent: user } = await createAuthenticatedAgent();
    await user.get('/api/admin/visits').expect(403);
    await agent().get('/api/admin/visits').expect(401);
  });

  it('after the day ends only its totals are left, and they still show', async () => {
    const yesterday = new Date(asDate(today()).getTime() - 86_400_000);
    await prisma.visitSalt.create({ data: { day: yesterday, salt: 'x'.repeat(64) } });
    await prisma.pageVisit.createMany({
      data: [
        {
          day: yesterday,
          visitor: 'a'.repeat(64),
          path: '/',
          source: 'google',
          signedIn: false,
          lang: 'en',
        },
        {
          day: yesterday,
          visitor: 'a'.repeat(64),
          path: '/courses',
          source: null,
          signedIn: false,
          lang: 'en',
        },
        {
          day: yesterday,
          visitor: 'b'.repeat(64),
          path: '/',
          source: 'direct',
          signedIn: true,
          lang: 'ro',
        },
      ],
    });
    await visit(agent(), { path: '/almanac' });

    await rollUp();
    await rollUp(); // a second run finds nothing left to do

    expect(await prisma.pageVisit.count({ where: { day: yesterday } })).toBe(0);
    expect(await prisma.visitSalt.count({ where: { day: yesterday } })).toBe(0);
    expect(await prisma.pageVisit.count()).toBe(1); // today's visit stays
    const totals = await prisma.visitTotal.findMany({ where: { day: yesterday } });
    expect(totals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ dimension: 'all', key: '', visitors: 2, views: 3 }),
        expect.objectContaining({ dimension: 'page', key: '/', visitors: 2, views: 2 }),
        expect.objectContaining({ dimension: 'source', key: 'google', visitors: 1, views: 1 }),
        expect.objectContaining({ dimension: 'auth', key: 'guest', visitors: 1, views: 2 }),
        expect.objectContaining({ dimension: 'lang', key: 'ro', visitors: 1, views: 1 }),
      ]),
    );
    expect(totals).toHaveLength(9);

    const res = await (await admin()).get('/api/admin/visits').expect(200);
    expect(res.body.days.at(-2)).toMatchObject({ visitors: 2, views: 3 });
    expect(res.body.days.at(-1)).toMatchObject({ visitors: 1, views: 1 });
  });

  it('puts an account made at 23:30 UTC on the next day, in Romania', async () => {
    const { email } = await createAuthenticatedAgent();
    const id = await userIdFor(email);
    const late = new Date(`${today()}T00:00:00Z`);
    late.setUTCHours(-1, 30); // the evening before, 23:30 UTC: past midnight in Romania
    await prisma.user.update({ where: { id }, data: { createdAt: late } });

    const res = await (await admin()).get('/api/admin/visits').expect(200);
    // The sentinel, this account and the admin all fall on today
    expect(res.body.days.at(-1).newAccounts).toBe(3);
  });
});
