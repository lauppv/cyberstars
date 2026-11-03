import { describe, it, expect } from 'vitest';
import { agent, createAuthenticatedAgent, userIdFor } from './helpers.js';
import { prisma } from '../../src/config/db.js';

type Notification = {
  id: number;
  type: string;
  entityId: number;
  actor: { name: string; avatarUrl: string | null } | null;
  readAt: string | null;
};

type Page = { items: Notification[]; unreadCount: number };

async function twoUsers() {
  const { agent: a, email: emailA } = await createAuthenticatedAgent();
  const { agent: b, email: emailB } = await createAuthenticatedAgent();
  return { a, b, idA: await userIdFor(emailA), idB: await userIdFor(emailB) };
}

async function page(who: ReturnType<typeof agent>): Promise<Page> {
  const res = await who.get('/api/notifications').expect(200);
  return res.body as Page;
}

// Notifications are emitted fire-and-forget (notify() is not awaited by the
// request), so poll until the expected type shows up rather than reading once.
async function waitForType(who: ReturnType<typeof agent>, type: string): Promise<Notification> {
  for (let i = 0; i < 50; i++) {
    const p = await page(who);
    const hit = p.items.find((n) => n.type === type);
    if (hit) return hit;
    await new Promise((r) => setTimeout(r, 20));
  }
  throw new Error(`notification of type ${type} never arrived`);
}

describe('Notifications flow', () => {
  it('a connection request notifies the addressee, not the requester', async () => {
    const { a, b, idA, idB } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);

    const notif = await waitForType(b, 'CONNECTION_REQUEST');
    expect(notif.readAt).toBeNull();
    expect(notif.actor?.name).toBeTruthy();

    const addresseeView = await page(b);
    expect(addresseeView.unreadCount).toBe(1);

    // The actor never notifies themselves.
    const requesterView = await page(a);
    expect(requesterView.items).toHaveLength(0);
    expect(requesterView.unreadCount).toBe(0);
    void idA;
  });

  it('accepting a request notifies the original requester', async () => {
    const { a, b, idB } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);
    const requestId = (await b.get('/api/connections').expect(200)).body.incoming[0].id;

    await b.post(`/api/connections/${requestId}/accept`).expect(200);

    const notif = await waitForType(a, 'CONNECTION_ACCEPTED');
    expect(notif.actor?.name).toBeTruthy();
  });

  it("responding to a request auto-reads the addressee's request bell", async () => {
    const { a, b, idB } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);
    await waitForType(b, 'CONNECTION_REQUEST');
    const requestId = (await b.get('/api/connections').expect(200)).body.incoming[0].id;

    await b.post(`/api/connections/${requestId}/accept`).expect(200);

    // The auto-read is fire-and-forget, and getPage reads the list and the
    // unread count as two separate (non-transactional) queries. Either read can
    // straddle the auto-read's commit, so during the window the row's readAt and
    // the count can disagree in *either* direction. Poll until both reflect the
    // read before asserting.
    let after = await page(b);
    for (let i = 0; i < 50 && (after.unreadCount !== 0 || after.items[0]?.readAt == null); i++) {
      await new Promise((r) => setTimeout(r, 20));
      after = await page(b);
    }
    expect(after.unreadCount).toBe(0);
    expect(after.items[0].readAt).not.toBeNull();
  });

  it('mark-read up-to clears the unread count', async () => {
    const { a, b, idB } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);
    const notif = await waitForType(b, 'CONNECTION_REQUEST');

    await b.post('/api/notifications/read').send({ upToId: notif.id }).expect(200);

    const after = await page(b);
    expect(after.unreadCount).toBe(0);
    expect(after.items[0].readAt).not.toBeNull();
  });

  it('mark a single notification read', async () => {
    const { a, b, idB } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);
    const notif = await waitForType(b, 'CONNECTION_REQUEST');

    await b.post(`/api/notifications/${notif.id}/read`).expect(200);

    const after = await page(b);
    expect(after.unreadCount).toBe(0);
  });

  it('unauthenticated requests are rejected', async () => {
    await agent().get('/api/notifications').expect(401);
  });
});

describe('Dashboard notices', () => {
  async function admin() {
    const { agent: a, email } = await createAuthenticatedAgent();
    await prisma.user.update({ where: { id: await userIdFor(email) }, data: { role: 'ADMIN' } });
    return a;
  }

  async function notices(who: ReturnType<typeof agent>): Promise<Notification[]> {
    return (await who.get('/api/notifications/notices').expect(200)).body as Notification[];
  }

  it('lists the unread announcements and polls oldest first, and nothing else', async () => {
    const { a, b, idB } = await twoUsers();
    const boss = await admin();
    await boss.post('/api/admin/announcements').send({ text: 'First' }).expect(201);
    await boss
      .post('/api/admin/polls')
      .send({ question: 'Which course next?', options: ['Rust', 'Go'] })
      .expect(201);
    await boss.post('/api/admin/announcements').send({ text: 'Third' }).expect(201);
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);
    await waitForType(b, 'CONNECTION_REQUEST');

    const list = await notices(b);
    expect(list.map((n) => n.type)).toEqual(['ANNOUNCEMENT', 'POLL', 'ANNOUNCEMENT']);
    expect(list.map((n) => n.id)).toEqual([...list.map((n) => n.id)].sort((x, y) => x - y));
  });

  it('leaves out one read, one voted in and the ones shown', async () => {
    const { agent: user } = await createAuthenticatedAgent();
    const boss = await admin();
    await boss.post('/api/admin/announcements').send({ text: 'Read in the bell' }).expect(201);
    await boss
      .post('/api/admin/polls')
      .send({ question: 'Voted from the phone?', options: ['Yes', 'No'] })
      .expect(201);
    await boss.post('/api/admin/announcements').send({ text: 'Shown' }).expect(201);
    await boss.post('/api/admin/announcements').send({ text: 'Still to show' }).expect(201);

    const [read, poll, shown, left] = await notices(user);
    await user.post(`/api/notifications/${read.id}/read`).expect(200);
    const options = (await user.get(`/api/polls/${poll.entityId}`).expect(200)).body.options;
    await user
      .post(`/api/polls/${poll.entityId}/vote`)
      .send({ optionIds: [options[0].id] })
      .expect(204);
    await user
      .post('/api/notifications/notices/shown')
      .send({ ids: [shown.id] })
      .expect(204);

    expect((await notices(user)).map((n) => n.id)).toEqual([left.id]);
    // Shown is not read: it stays unread in the bell
    expect((await page(user)).unreadCount).toBe(3);
  });

  it("marks only the caller's own shown", async () => {
    const { agent: user } = await createAuthenticatedAgent();
    const { agent: other } = await createAuthenticatedAgent();
    const boss = await admin();
    await boss.post('/api/admin/announcements').send({ text: 'Hi' }).expect(201);
    const [mine] = await notices(user);

    await other
      .post('/api/notifications/notices/shown')
      .send({ ids: [mine.id] })
      .expect(204);
    expect(await notices(user)).toHaveLength(1);
  });

  it('refuses a list of ids that is empty, too long or not ids (400)', async () => {
    const { agent: user } = await createAuthenticatedAgent();
    await user.post('/api/notifications/notices/shown').send({ ids: [] }).expect(400);
    await user
      .post('/api/notifications/notices/shown')
      .send({ ids: ['x'] })
      .expect(400);
    await user.post('/api/notifications/notices/shown').send({}).expect(400);
    // More than the window ever opens with
    const ids = Array.from({ length: 101 }, (_, i) => i + 1);
    await user.post('/api/notifications/notices/shown').send({ ids }).expect(400);
  });

  it('unauthenticated requests are rejected', async () => {
    await agent().get('/api/notifications/notices').expect(401);
    await agent()
      .post('/api/notifications/notices/shown')
      .send({ ids: [1] })
      .expect(401);
  });
});
