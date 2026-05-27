import { describe, it, expect } from 'vitest';
import { agent, createAuthenticatedAgent } from './helpers.js';

describe('Forum flow', () => {
  it('GET /categories returns seeded categories', async () => {
    const res = await agent().get('/api/forum/categories').expect(200);
    expect(res.body.length).toBeGreaterThan(0);
    const slugs = res.body.map((c: { slug: string }) => c.slug);
    expect(slugs).toContain('help-python');
  });

  it('create thread → get thread → shows initial post', async () => {
    const { agent: a, name } = await createAuthenticatedAgent();

    const create = await a
      .post('/api/forum/threads')
      .send({ categorySlug: 'help-python', title: 'How do loops work?', content: 'I need help.' })
      .expect(201);

    const threadId = create.body.threadId;
    expect(threadId).toBeDefined();

    const thread = await a.get(`/api/forum/threads/${threadId}`).expect(200);
    expect(thread.body.title).toBe('How do loops work?');
    expect(thread.body.posts.length).toBe(1);
    expect(thread.body.posts[0].content).toBe('I need help.');
    expect(thread.body.posts[0].authorName).toBe(name);
  });

  it('post reply → thread has two posts', async () => {
    const { agent: author } = await createAuthenticatedAgent();
    const { agent: replier } = await createAuthenticatedAgent();

    const create = await author
      .post('/api/forum/threads')
      .send({ categorySlug: 'help-python', title: 'Question', content: 'Help please' })
      .expect(201);

    const threadId = create.body.threadId;

    await replier
      .post(`/api/forum/threads/${threadId}/posts`)
      .send({ content: 'Here is the answer!' })
      .expect(201);

    const thread = await agent().get(`/api/forum/threads/${threadId}`).expect(200);
    expect(thread.body.posts.length).toBe(2);
    expect(thread.body.posts[1].content).toBe('Here is the answer!');
  });

  it('toggle reaction on/off', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    const create = await a
      .post('/api/forum/threads')
      .send({ categorySlug: 'help-python', title: 'Test', content: 'Content' })
      .expect(201);

    const thread = await a.get(`/api/forum/threads/${create.body.threadId}`).expect(200);
    const postId = thread.body.posts[0].id;

    const on = await a
      .post(`/api/forum/posts/${postId}/reactions`)
      .send({ emoji: '👍' })
      .expect(200);
    expect(on.body.active).toBe(true);

    const off = await a
      .post(`/api/forum/posts/${postId}/reactions`)
      .send({ emoji: '👍' })
      .expect(200);
    expect(off.body.active).toBe(false);
  });

  it('unauthenticated user cannot create thread', async () => {
    await agent()
      .post('/api/forum/threads')
      .send({ categorySlug: 'help-python', title: 'Nope', content: 'No auth' })
      .expect(401);
  });

  it('soft-delete own post', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    const create = await a
      .post('/api/forum/threads')
      .send({ categorySlug: 'help-python', title: 'Del test', content: 'Will delete' })
      .expect(201);

    const thread = await a.get(`/api/forum/threads/${create.body.threadId}`).expect(200);
    const postId = thread.body.posts[0].id;

    await a.delete(`/api/forum/posts/${postId}`).expect(200);

    const after = await a.get(`/api/forum/threads/${create.body.threadId}`).expect(200);
    expect(after.body.posts[0].deleted).toBe(true);
    expect(after.body.posts[0].content).toBe('');
  });

  it('edit post updates content and sets editedByName', async () => {
    const { agent: a, name } = await createAuthenticatedAgent();

    const create = await a
      .post('/api/forum/threads')
      .send({ categorySlug: 'help-python', title: 'Edit test', content: 'Original' })
      .expect(201);

    const thread = await a.get(`/api/forum/threads/${create.body.threadId}`).expect(200);
    const postId = thread.body.posts[0].id;

    await a.put(`/api/forum/posts/${postId}`).send({ content: 'Updated content' }).expect(200);

    const after = await a.get(`/api/forum/threads/${create.body.threadId}`).expect(200);
    expect(after.body.posts[0].content).toBe('Updated content');
    expect(after.body.posts[0].editedByName).toBe(name);
  });

  it('user cannot post in announcements', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    await a
      .post('/api/forum/threads')
      .send({ categorySlug: 'announcements', title: 'Nope', content: 'Should fail' })
      .expect(403);
  });

  it('user cannot delete another user post', async () => {
    const { agent: author } = await createAuthenticatedAgent();
    const { agent: other } = await createAuthenticatedAgent();

    const create = await author
      .post('/api/forum/threads')
      .send({ categorySlug: 'help-python', title: 'Mine', content: 'My post' })
      .expect(201);

    const thread = await author.get(`/api/forum/threads/${create.body.threadId}`).expect(200);
    const postId = thread.body.posts[0].id;

    await other.delete(`/api/forum/posts/${postId}`).expect(403);
  });

  it('multiple users reacting shows correct count', async () => {
    const { agent: a1 } = await createAuthenticatedAgent();
    const { agent: a2 } = await createAuthenticatedAgent();
    const { agent: a3 } = await createAuthenticatedAgent();

    const create = await a1
      .post('/api/forum/threads')
      .send({ categorySlug: 'help-python', title: 'Reactions', content: 'Like this' })
      .expect(201);

    const thread = await a1.get(`/api/forum/threads/${create.body.threadId}`).expect(200);
    const postId = thread.body.posts[0].id;

    await a1.post(`/api/forum/posts/${postId}/reactions`).send({ emoji: '👍' }).expect(200);
    await a2.post(`/api/forum/posts/${postId}/reactions`).send({ emoji: '👍' }).expect(200);
    await a3.post(`/api/forum/posts/${postId}/reactions`).send({ emoji: '👍' }).expect(200);

    const after = await a1.get(`/api/forum/threads/${create.body.threadId}`).expect(200);
    const thumbs = after.body.posts[0].reactions.find((r: { emoji: string }) => r.emoji === '👍');
    expect(thumbs.count).toBe(3);
  });

  it('thread views increment on each GET', async () => {
    const { agent: a } = await createAuthenticatedAgent();

    const create = await a
      .post('/api/forum/threads')
      .send({ categorySlug: 'help-python', title: 'Views test', content: 'Content' })
      .expect(201);

    const first = await agent().get(`/api/forum/threads/${create.body.threadId}`).expect(200);
    const second = await agent().get(`/api/forum/threads/${create.body.threadId}`).expect(200);
    expect(second.body.views).toBeGreaterThan(first.body.views);
  });
});
