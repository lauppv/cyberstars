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

type Sections = {
  forum: { entityId: number; title: string }[];
  support: { entityId: number; title: string }[];
  connections: number;
  laniakea: number;
};

type Page = { items: Notification[]; unreadCount: number; sections: Sections };

async function twoUsers() {
  const { agent: a, email: emailA } = await createAuthenticatedAgent();
  const { agent: b, email: emailB } = await createAuthenticatedAgent();
  return { a, b, idA: await userIdFor(emailA), idB: await userIdFor(emailB) };
}

async function admin() {
  const { agent: a, email } = await createAuthenticatedAgent();
  await prisma.user.update({ where: { id: await userIdFor(email) }, data: { role: 'ADMIN' } });
  return a;
}

async function page(who: ReturnType<typeof agent>): Promise<Page> {
  const res = await who.get('/api/notifications').expect(200);
  return res.body as Page;
}

// Notifications are emitted fire-and-forget (notify() is not awaited by the
// request), and the auto-reads are too, so poll until the page shows what is
// expected rather than reading once.
async function waitFor(
  who: ReturnType<typeof agent>,
  done: (p: Page) => boolean,
  what: string,
): Promise<Page> {
  for (let i = 0; i < 50; i++) {
    const p = await page(who);
    if (done(p)) return p;
    await new Promise((r) => setTimeout(r, 20));
  }
  throw new Error(`${what} never showed`);
}

async function thread(author: ReturnType<typeof agent>, title: string): Promise<number> {
  const res = await author
    .post('/api/forum/threads')
    .send({ categorySlug: 'help-python', title, content: 'Help please' })
    .expect(201);
  return res.body.threadId;
}

describe('Notifications flow', () => {
  it("a connection request counts on the addressee's sidebar, not in the bell", async () => {
    const { a, b, idB } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);

    const addresseeView = await waitFor(b, (p) => p.sections.connections === 1, 'the request');
    expect(addresseeView.items).toHaveLength(0);
    expect(addresseeView.unreadCount).toBe(0);

    // The actor never notifies themselves.
    const requesterView = await page(a);
    expect(requesterView.sections.connections).toBe(0);
  });

  it("accepting a request counts on the requester's sidebar", async () => {
    const { a, b, idB } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);
    const requestId = (await b.get('/api/connections').expect(200)).body.incoming[0].id;

    await b.post(`/api/connections/${requestId}/accept`).expect(200);

    await waitFor(a, (p) => p.sections.connections === 1, 'the acceptance');
  });

  it("responding to a request reads the addressee's request", async () => {
    const { a, b, idB } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);
    await waitFor(b, (p) => p.sections.connections === 1, 'the request');
    const requestId = (await b.get('/api/connections').expect(200)).body.incoming[0].id;

    await b.post(`/api/connections/${requestId}/accept`).expect(200);

    await waitFor(b, (p) => p.sections.connections === 0, 'the read');
  });

  it('opening the connections page reads the whole section', async () => {
    const { a, b, idB } = await twoUsers();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);
    await waitFor(b, (p) => p.sections.connections === 1, 'the request');

    await b.post('/api/notifications/sections/read').send({ section: 'connections' }).expect(204);

    expect((await page(b)).sections.connections).toBe(0);
  });

  it("a reply lists the thread on the author's forum row until they open it", async () => {
    const { a, b } = await twoUsers();
    const loops = await thread(a, 'Loops');
    const lists = await thread(a, 'Lists');
    await b.post(`/api/forum/threads/${loops}/posts`).send({ content: 'One' }).expect(201);
    await b.post(`/api/forum/threads/${lists}/posts`).send({ content: 'Two' }).expect(201);
    await b.post(`/api/forum/threads/${loops}/posts`).send({ content: 'Three' }).expect(201);

    const before = await waitFor(
      a,
      (p) => p.sections.forum.length === 2,
      'both threads on the forum row',
    );
    expect(before.items).toHaveLength(0);
    expect(before.sections.forum.map((e) => e.entityId).sort()).toEqual([loops, lists].sort());
    expect(before.sections.forum.find((e) => e.entityId === loops)?.title).toBe('Loops');

    await a
      .post('/api/notifications/sections/read')
      .send({ section: 'forum', entityId: loops })
      .expect(204);

    expect((await page(a)).sections.forum).toEqual([{ entityId: lists, title: 'Lists' }]);
  });

  it('a reaction on the forum notifies no one', async () => {
    const { a, b, idA } = await twoUsers();
    const id = await thread(a, 'Reactions');
    const postId = (await a.get(`/api/forum/threads/${id}`).expect(200)).body.posts[0].id;

    await b.post(`/api/forum/posts/${postId}/reactions`).send({ emoji: '👍' }).expect(200);
    // A reply after it shows the notify path ran, so the reaction's absence is real
    await b.post(`/api/forum/threads/${id}/posts`).send({ content: 'Nice' }).expect(201);
    await waitFor(a, (p) => p.sections.forum.length === 1, 'the reply');

    const rows = await prisma.notification.findMany({ where: { userId: idA } });
    expect(rows.map((r) => r.type)).toEqual(['FORUM_REPLY']);
  });

  it("reads only the caller's own section", async () => {
    const { a, b } = await twoUsers();
    const { agent: c } = await createAuthenticatedAgent();
    const id = await thread(a, 'Mine');
    await b.post(`/api/forum/threads/${id}/posts`).send({ content: 'Hi' }).expect(201);
    await waitFor(a, (p) => p.sections.forum.length === 1, 'the reply');

    await c
      .post('/api/notifications/sections/read')
      .send({ section: 'forum', entityId: id })
      .expect(204);

    expect((await page(a)).sections.forum).toHaveLength(1);
  });

  it('refuses a section that is not one (400)', async () => {
    const { a } = await twoUsers();
    await a.post('/api/notifications/sections/read').send({ section: 'bell' }).expect(400);
    await a
      .post('/api/notifications/sections/read')
      .send({ section: 'forum', entityId: 'x' })
      .expect(400);
  });

  it("mark-read up-to clears the bell and leaves the sidebar's counts", async () => {
    const { a, b, idB } = await twoUsers();
    const boss = await admin();
    await a.post('/api/connections').send({ addresseeId: idB }).expect(201);
    await waitFor(b, (p) => p.sections.connections === 1, 'the request');
    await boss.post('/api/admin/announcements').send({ text: 'Hello' }).expect(201);
    const [notice] = (await page(b)).items;

    await b.post('/api/notifications/read').send({ upToId: notice.id }).expect(200);

    const after = await page(b);
    expect(after.unreadCount).toBe(0);
    expect(after.items[0].readAt).not.toBeNull();
    expect(after.sections.connections).toBe(1);
  });

  it('mark a single notification read', async () => {
    const { b } = await twoUsers();
    const boss = await admin();
    await boss.post('/api/admin/announcements').send({ text: 'Hello' }).expect(201);
    const [notice] = (await page(b)).items;
    expect((await page(b)).unreadCount).toBe(1);

    await b.post(`/api/notifications/${notice.id}/read`).expect(200);

    expect((await page(b)).unreadCount).toBe(0);
  });

  it('unauthenticated requests are rejected', async () => {
    await agent().get('/api/notifications').expect(401);
    await agent().post('/api/notifications/sections/read').send({ section: 'forum' }).expect(401);
  });
});

describe('Dashboard notices', () => {
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
    await waitFor(b, (p) => p.sections.connections === 1, 'the request');

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
