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
    await visit(guest, { path: '/courses', active: true });
    await visit(guest, { path: '/ro/courses' });

    const res = await (await admin()).get('/api/admin/visits').expect(200);
    const day = res.body.days.at(-1);
    expect(day).toMatchObject({ day: today(), visitors: 1, views: 3, idle: 0 });
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

  it('counts a guest who only loads pages apart, out of every other number and the list', async () => {
    // A person: did something on the placement test's page, then left
    const person = agent();
    await visit(person, { path: '/placement', referrer: 'www.google.com' }, 'Person');
    await person
      .post('/api/visits/steps')
      .set('User-Agent', 'Person')
      .send({ steps: [], active: true })
      .expect(204);
    // Scrapers: a real browser from three home IPs, one page each, nothing done.
    // A scroll alone doesn't make one a person, since a script can scroll.
    await visit(agent(), { path: '/placement', referrer: '' }, 'Scraper 1');
    await visit(agent(), { path: '/lesson/python/print', referrer: '' }, 'Scraper 2');
    const third = agent();
    await visit(third, { path: '/ro/almanac', referrer: '' }, 'Scraper 3');
    await third
      .post('/api/visits/steps')
      .set('User-Agent', 'Scraper 3')
      .send({ steps: [{ kind: 'scroll', target: '100' }] })
      .expect(204);

    const a = await admin();
    const res = await a.get('/api/admin/visits').expect(200);
    expect(res.body.days.at(-1)).toMatchObject({ visitors: 1, views: 1, idle: 3 });
    expect(res.body.pages).toEqual([{ key: '/placement', visitors: 1, views: 1 }]);
    expect(res.body.sources).toEqual([{ key: 'google', visitors: 1, views: 1 }]);
    expect(res.body.auth).toEqual([{ key: 'guest', visitors: 1, views: 1 }]);
    expect(res.body.lang).toEqual([{ key: 'en', visitors: 1, views: 1 }]);
    expect(res.body.placement.opened).toBe(1);

    const list = await a.get('/api/admin/visits/guests').expect(200);
    expect(list.body.visits.map((v: { source: string }) => v.source)).toEqual(['google']);
    expect(list.body.idle).toBe(3);
    const direct = await a.get('/api/admin/visits/guests?source=direct').expect(200);
    expect(direct.body).toMatchObject({ visits: [], idle: 3 });
  });

  it('counts a guest with the people from the moment they do something, all their pages too', async () => {
    const guest = agent();
    await visit(guest, { path: '/' });
    await visit(guest, { path: '/courses' });
    const a = await admin();
    expect((await a.get('/api/admin/visits').expect(200)).body.days.at(-1)).toMatchObject({
      visitors: 0,
      idle: 1,
    });

    await visit(guest, { path: '/algorithms', active: true });
    expect((await a.get('/api/admin/visits').expect(200)).body.days.at(-1)).toMatchObject({
      visitors: 1,
      views: 3,
      idle: 0,
    });
  });

  it('counts a signed-in student with the people without anything done, and a guest who signs in', async () => {
    const { agent: student } = await createAuthenticatedAgent();
    await visit(student, { path: '/dashboard' }, 'Student browser');
    // A guest who looked around, made an account and goes on signed in
    const guest = agent();
    await visit(guest, { path: '/getstarted' }, 'New browser');
    await guest
      .post('/auth/signup')
      .send({ name: 'Ana Maria', email: 'ana@test.com', password: 'password123' })
      .expect(200);
    await visit(guest, { path: '/tour' }, 'New browser');

    const res = await (await admin()).get('/api/admin/visits').expect(200);
    expect(res.body.days.at(-1)).toMatchObject({ visitors: 2, views: 3, idle: 0 });
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
        // A guest who only loaded two pages
        {
          day: yesterday,
          visitor: 'c'.repeat(64),
          path: '/almanac',
          source: 'direct',
          signedIn: false,
          lang: 'en',
        },
        {
          day: yesterday,
          visitor: 'c'.repeat(64),
          path: '/courses',
          source: null,
          signedIn: false,
          lang: 'en',
        },
      ],
    });
    await prisma.guestVisit.createMany({
      data: [
        { day: yesterday, visitor: 'a'.repeat(64), source: 'google', lang: 'en', active: true },
        { day: yesterday, visitor: 'c'.repeat(64), source: 'direct', lang: 'en' },
      ],
    });
    await visit(agent(), { path: '/almanac', active: true });

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
        expect.objectContaining({ dimension: 'idle', key: '', visitors: 1, views: 2 }),
      ]),
    );
    expect(totals).toHaveLength(10);
    // Read before the hashes went: the people stay the people
    expect(await prisma.guestVisit.count({ where: { day: yesterday, visitor: null } })).toBe(2);

    const res = await (await admin()).get('/api/admin/visits').expect(200);
    expect(res.body.days.at(-2)).toMatchObject({ visitors: 2, views: 3, idle: 1 });
    expect(res.body.days.at(-1)).toMatchObject({ visitors: 1, views: 1, idle: 0 });
  });

  it("keeps a guest's pages, clicks and scrolls as one visit, in order, from its first page's time", async () => {
    const guest = agent();
    const arrived = Date.now();
    await visit(guest, { path: '/', referrer: 'old.reddit.com' });
    await guest
      .post('/api/visits/steps')
      .set('User-Agent', BROWSER)
      .send({ steps: [{ kind: 'scroll', target: '75' }] })
      .expect(204);
    await visit(guest, { path: '/courses', steps: [{ kind: 'click', target: 'start-learning' }] });

    const res = await (await admin()).get('/api/admin/visits/guests').expect(200);
    expect(res.body).toEqual({
      visits: [
        {
          id: expect.any(Number),
          day: today(),
          startedAt: expect.any(String),
          source: 'reddit',
          lang: 'en',
          steps: [
            { kind: 'page', target: '/' },
            { kind: 'scroll', target: '75' },
            { kind: 'click', target: 'start-learning' },
            { kind: 'page', target: '/courses' },
          ],
        },
      ],
      next: null,
      idle: 0,
    });
    // Set when the first page came in
    const startedAt = Date.parse(res.body.visits[0].startedAt);
    expect(startedAt).toBeGreaterThanOrEqual(arrived - 1000);
    expect(startedAt).toBeLessThanOrEqual(Date.now());
    const totals = await (await admin()).get('/api/admin/visits').expect(200);
    expect(totals.body.clicks).toEqual([{ key: 'start-learning', visitors: 1, views: 1 }]);
  });

  it('lines up how far guests got in the placement test', async () => {
    const steps = (...targets: string[]) => targets.map((target) => ({ kind: 'click', target }));
    const quitter = agent();
    await visit(quitter, { path: '/' });
    await visit(quitter, { path: '/placement', steps: steps('test-me') });
    await visit(quitter, { path: '/', steps: steps('placement-start', 'placement-q1') });
    // A visitor is its IP and user agent, so the second guest needs another browser
    const finisher = agent();
    const other = 'Other browser';
    await visit(finisher, { path: '/ro/placement' }, other);
    const answers = Array.from({ length: 9 }, (_, i) => `placement-q${i + 1}`);
    await visit(
      finisher,
      {
        path: '/ro/getstarted',
        steps: steps('placement-start', ...answers, 'placement-submit', 'placement-get-started'),
      },
      other,
    );
    await visit(finisher, { path: '/ro/placement' }, other);

    const res = await (await admin()).get('/api/admin/visits').expect(200);
    expect(res.body.placement).toEqual({
      opened: 2,
      started: 2,
      answered: [2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      getStarted: 1,
    });
  });

  it('gives a student no visit, but keeps what a guest pressed on the way to an account', async () => {
    const { agent: student } = await createAuthenticatedAgent();
    await visit(student, { path: '/lesson/python/print' }, 'Student browser');
    expect(await prisma.guestVisit.count()).toBe(0);

    const guest = agent();
    await visit(guest, { path: '/getstarted' }, 'Guest browser');
    await guest
      .post('/auth/signup')
      .send({ name: 'Ana Maria', email: 'ana@test.com', password: 'password123' })
      .expect(200);
    await visit(
      guest,
      { path: '/lesson/python/print', steps: [{ kind: 'click', target: 'sign-up' }] },
      'Guest browser',
    );

    const steps = await prisma.visitStep.findMany({ orderBy: { id: 'asc' } });
    expect(steps.map((s) => s.target)).toEqual(['/getstarted', 'sign-up']);
  });

  it('refuses steps that carry text', async () => {
    await agent()
      .post('/api/visits/steps')
      .set('User-Agent', BROWSER)
      .send({ steps: [{ kind: 'click', target: 'My name is Ana' }] })
      .expect(400);
  });

  it("keeps a finished day's guest visits without their hash, for 728 days", async () => {
    const day = (n: number) => new Date(asDate(today()).getTime() - n * 86_400_000);
    await prisma.guestVisit.create({
      data: { day: day(1), visitor: 'a'.repeat(64), source: 'google', lang: 'en' },
    });
    await prisma.guestVisit.create({
      data: { day: day(727), visitor: null, source: null, lang: 'en' },
    });
    await prisma.guestVisit.create({
      data: {
        day: day(728),
        visitor: null,
        source: null,
        lang: 'en',
        steps: { create: [{ kind: 'page', target: '/' }] },
      },
    });
    await visit(agent(), { path: '/' });

    await rollUp();

    const left = await prisma.guestVisit.findMany({ orderBy: { day: 'asc' } });
    expect(left.map((v) => [v.day, v.visitor === null])).toEqual([
      [day(727), true],
      [day(1), true],
      [asDate(today()), false], // today's still has its hash
    ]);
    expect(await prisma.visitStep.count()).toBe(1); // the expired visit's step went with it
  });

  it('only an admin sees the guest visits', async () => {
    const { agent: user } = await createAuthenticatedAgent();
    await user.get('/api/admin/visits/guests').expect(403);
    await agent().get('/api/admin/visits/guests').expect(401);
  });

  it('puts an account made at 23:30 UTC on the next day, in Romania', async () => {
    const { email } = await createAuthenticatedAgent();
    const id = await userIdFor(email);
    const late = new Date(`${today()}T00:00:00Z`);
    late.setUTCHours(-1, 30); // the evening before, 23:30 UTC: past midnight in Romania
    await prisma.user.update({ where: { id }, data: { createdAt: late } });

    const res = await (await admin()).get('/api/admin/visits').expect(200);
    // Falls on today, with the sentinel and the admin left out: they aren't students
    expect(res.body.days.at(-1).newAccounts).toBe(1);
  });
});
