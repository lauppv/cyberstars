import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler.js';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const mockPrisma = {
  forumCategory: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    aggregate: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  forumThread: {
    count: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  forumPost: {
    count: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  },
  forumReaction: {
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  forumThreadView: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
  $transaction: vi.fn((ops) => Promise.all(ops)),
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const mockUserRepo = {
  getRole: vi.fn(),
  updateRole: vi.fn(),
  countByRole: vi.fn(),
  getAdminIds: vi.fn().mockResolvedValue([]),
};
vi.mock('../repositories/user.repository.js', () => mockUserRepo);

const mockNotifications = { notify: vi.fn(), redactExcerpt: vi.fn() };
vi.mock('../services/notifications.service.js', () => mockNotifications);

const {
  getCategories,
  getThreads,
  getThread,
  createThread,
  createPost,
  toggleReaction,
  markSolution,
  updatePost,
  deletePost,
  deleteThread,
  updateUserRole,
  createCategory,
  updateCategory,
  deleteCategory,
} = await import('./forum.controller.js');

function mockReq(overrides: Partial<Request> = {}): Request {
  return { params: {}, body: {}, user: undefined, ...overrides } as unknown as Request;
}

function mockRes(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe('getCategories', () => {
  it('returns categories with counts', async () => {
    mockPrisma.forumCategory.findMany.mockResolvedValue([
      {
        id: 1,
        slug: 'general',
        name: 'General',
        description: 'desc',
        icon: '💬',
        color: '#fff',
        groupName: 'Main',
        threads: [
          {
            id: 1,
            title: 'Hello',
            posts: [{ createdAt: new Date('2025-01-01'), author: { name: 'Alice' } }],
            _count: { posts: 10 },
          },
        ],
      },
    ]);

    const res = mockRes();
    const next = vi.fn();
    await getCategories(mockReq(), res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({
        slug: 'general',
        threadCount: 1,
        postCount: 10,
        lastPost: expect.objectContaining({ threadTitle: 'Hello' }),
      }),
    ]);
  });

  it('excludes deleted posts when picking the category last-post', async () => {
    mockPrisma.forumCategory.findMany.mockResolvedValue([]);
    await getCategories(mockReq(), mockRes(), vi.fn());
    const arg = mockPrisma.forumCategory.findMany.mock.calls[0][0];
    expect(arg.include.threads.select.posts.where).toEqual({ deleted: false });
  });

  it('picks the most recent post across threads and ignores empty ones', async () => {
    mockPrisma.forumCategory.findMany.mockResolvedValue([
      {
        id: 1,
        slug: 'general',
        name: 'General',
        description: '',
        icon: '',
        color: '',
        groupName: 'Main',
        threads: [
          {
            id: 1,
            title: 'Oldest',
            posts: [{ createdAt: new Date('2025-01-01'), author: { name: 'A' } }],
            _count: { posts: 1 },
          },
          {
            id: 2,
            title: 'Newest',
            posts: [{ createdAt: new Date('2025-03-01'), author: { name: 'B' } }],
            _count: { posts: 1 },
          },
          {
            id: 3,
            title: 'Middle',
            posts: [{ createdAt: new Date('2025-02-01'), author: { name: 'C' } }],
            _count: { posts: 1 },
          },
          {
            id: 4,
            title: 'Empty',
            posts: [],
            _count: { posts: 0 },
          },
        ],
      },
    ]);

    const res = mockRes();
    await getCategories(mockReq(), res, vi.fn());
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({
        threadCount: 4,
        postCount: 3,
        lastPost: expect.objectContaining({ threadTitle: 'Newest', authorName: 'B' }),
      }),
    ]);
  });
});

describe('getThreads', () => {
  it('returns 404 for missing category', async () => {
    mockPrisma.forumCategory.findUnique.mockResolvedValue(null);
    const next = vi.fn();
    await getThreads(
      mockReq({ params: { categorySlug: 'nope' } as Record<string, string> }),
      mockRes(),
      next,
    );
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(404);
  });

  it('returns threads for a valid category', async () => {
    mockPrisma.forumCategory.findUnique.mockResolvedValue({
      id: 1,
      slug: 'general',
      name: 'General',
      description: '',
      icon: '',
      color: '',
    });
    mockPrisma.forumThread.findMany.mockResolvedValue([
      {
        id: 10,
        title: 'Hello',
        pinned: false,
        locked: false,
        solved: false,
        views: 3,
        authorId: 1,
        author: { name: 'Alice', role: 'USER' },
        posts: [{ author: { name: 'Bob' }, createdAt: new Date('2025-01-01') }],
        _count: { posts: 2 },
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      },
    ]);

    const res = mockRes();
    await getThreads(
      mockReq({ params: { categorySlug: 'general' } as Record<string, string> }),
      res,
      vi.fn(),
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        category: expect.objectContaining({ slug: 'general' }),
        threads: [expect.objectContaining({ id: 10, replyCount: 1 })],
      }),
    );
  });

  it('counts every post (incl. deleted) so replyCount survives a deleted opener', async () => {
    mockPrisma.forumCategory.findUnique.mockResolvedValue({
      id: 1,
      slug: 'general',
      name: 'General',
      description: '',
      icon: '',
      color: '',
    });
    mockPrisma.forumThread.findMany.mockResolvedValue([
      {
        id: 12,
        title: 'Opener deleted',
        pinned: false,
        locked: false,
        solved: false,
        views: 0,
        authorId: 1,
        author: { name: 'Alice', role: 'USER' },
        posts: [{ author: { name: 'Bob' }, createdAt: new Date('2025-01-03') }],
        // OP + 2 replies = 3 total; replyCount must be 2, not undercounted.
        _count: { posts: 3 },
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      },
    ]);

    const res = mockRes();
    await getThreads(
      mockReq({ params: { categorySlug: 'general' } as Record<string, string> }),
      res,
      vi.fn(),
    );
    expect(mockPrisma.forumThread.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({ _count: { select: { posts: true } } }),
      }),
    );
    const findManyArg = mockPrisma.forumThread.findMany.mock.calls[0][0];
    expect(findManyArg.include.posts.where).toEqual({ deleted: false });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ threads: [expect.objectContaining({ id: 12, replyCount: 2 })] }),
    );
  });

  it('reports null last-post fields for a thread with no posts', async () => {
    mockPrisma.forumCategory.findUnique.mockResolvedValue({
      id: 1,
      slug: 'general',
      name: 'General',
      description: '',
      icon: '',
      color: '',
    });
    mockPrisma.forumThread.findMany.mockResolvedValue([
      {
        id: 11,
        title: 'Empty',
        pinned: false,
        locked: false,
        solved: false,
        views: 0,
        authorId: 1,
        author: { name: 'Alice', role: 'USER' },
        posts: [],
        _count: { posts: 0 },
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      },
    ]);

    const res = mockRes();
    await getThreads(
      mockReq({ params: { categorySlug: 'general' } as Record<string, string> }),
      res,
      vi.fn(),
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        threads: [
          expect.objectContaining({
            id: 11,
            replyCount: 0,
            lastPostAuthor: null,
            lastPostAt: null,
          }),
        ],
      }),
    );
  });
});

describe('getThread', () => {
  it('returns 400 for invalid thread ID', async () => {
    const next = vi.fn();
    await getThread(
      mockReq({ params: { threadId: 'abc' } as Record<string, string> }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it('returns 404 for missing thread', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue(null);
    const next = vi.fn();
    await getThread(
      mockReq({ params: { threadId: '999' } as Record<string, string> }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(404);
  });

  const threadFixture = (views: number, authorId = 1) => ({
    id: 1,
    title: 'T',
    pinned: false,
    locked: false,
    solved: false,
    views,
    authorId,
    author: { name: 'A', role: 'USER' },
    category: { slug: 'general', name: 'General' },
    createdAt: new Date(),
    posts: [],
  });

  it('counts a first-time view from a non-author and increments views', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue(threadFixture(5));
    mockPrisma.forumThreadView.findUnique.mockResolvedValue(null);
    mockPrisma.forumThreadView.create.mockResolvedValue({});
    mockPrisma.forumThread.update.mockResolvedValue({});

    const res = mockRes();
    await getThread(
      mockReq({ params: { threadId: '1' }, user: { id: 7 } as Request['user'] }),
      res,
      vi.fn(),
    );
    expect(mockPrisma.forumThreadView.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ viewerKey: 'user:7' }) }),
    );
    expect(mockPrisma.forumThread.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 }, data: { views: { increment: 1 } } }),
    );
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1, views: 6 }));
  });

  it('does not count a view from the thread author', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue(threadFixture(5, 7));

    const res = mockRes();
    await getThread(
      mockReq({ params: { threadId: '1' }, user: { id: 7 } as Request['user'] }),
      res,
      vi.fn(),
    );
    expect(mockPrisma.forumThreadView.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.forumThread.update).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ views: 5 }));
  });

  it('does not re-count a view within 24h', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue(threadFixture(5));
    mockPrisma.forumThreadView.findUnique.mockResolvedValue({ id: 9, viewedAt: new Date() });

    const res = mockRes();
    await getThread(
      mockReq({ params: { threadId: '1' }, user: { id: 7 } as Request['user'] }),
      res,
      vi.fn(),
    );
    expect(mockPrisma.forumThread.update).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ views: 5 }));
  });

  it('re-counts a view once the 24h window has elapsed', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue(threadFixture(5));
    mockPrisma.forumThreadView.findUnique.mockResolvedValue({
      id: 9,
      viewedAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
    });
    mockPrisma.forumThreadView.update.mockResolvedValue({});
    mockPrisma.forumThread.update.mockResolvedValue({});

    const res = mockRes();
    await getThread(
      mockReq({ params: { threadId: '1' }, user: { id: 7 } as Request['user'] }),
      res,
      vi.fn(),
    );
    expect(mockPrisma.forumThreadView.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 9 } }),
    );
    expect(mockPrisma.forumThread.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { views: { increment: 1 } } }),
    );
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ views: 6 }));
  });

  it('counts a guest view keyed by the guestId cookie', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue(threadFixture(5));
    mockPrisma.forumThreadView.findUnique.mockResolvedValue(null);
    mockPrisma.forumThreadView.create.mockResolvedValue({});
    mockPrisma.forumThread.update.mockResolvedValue({});

    const res = mockRes();
    await getThread(
      mockReq({ params: { threadId: '1' }, cookies: { guestId: 'g-1' } } as Partial<Request>),
      res,
      vi.fn(),
    );
    expect(mockPrisma.forumThreadView.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ viewerKey: 'guest:g-1' }) }),
    );
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ views: 6 }));
  });

  it('groups reactions (marking the viewer active) and blanks deleted posts', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue({
      id: 1,
      title: 'T',
      pinned: false,
      locked: false,
      solved: false,
      views: 0,
      authorId: 1,
      author: { name: 'A', role: 'USER' },
      category: { slug: 'general', name: 'General' },
      createdAt: new Date(),
      posts: [
        {
          id: 100,
          content: 'visible',
          solution: false,
          deleted: false,
          deletedByName: null,
          editedByName: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: { id: 1, name: 'Bob', role: 'USER', avatarUrl: null },
          reactions: [
            { emoji: '👍', userId: 1, user: { name: 'Bob' } },
            { emoji: '👍', userId: 7, user: { name: 'Me' } },
          ],
        },
        {
          id: 101,
          content: 'secret',
          solution: false,
          deleted: true,
          deletedByName: 'Mod',
          editedByName: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: { id: 2, name: 'Carol', role: 'USER', avatarUrl: null },
          reactions: [],
        },
      ],
    });
    mockPrisma.forumThread.update.mockResolvedValue({});

    const res = mockRes();
    await getThread(
      mockReq({
        params: { threadId: '1' } as Record<string, string>,
        user: { id: 7 } as Request['user'],
      }),
      res,
      vi.fn(),
    );

    const payload = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0] as {
      posts: Array<{
        id: number;
        content: string;
        reactions: Array<{ count: number; active: boolean }>;
      }>;
    };
    const visible = payload.posts.find((p) => p.id === 100)!;
    const deleted = payload.posts.find((p) => p.id === 101)!;
    expect(visible.reactions[0]).toMatchObject({ count: 2, active: true });
    expect(deleted.content).toBe('');
  });

  it('keeps a grouped reaction inactive when later reactors are not the viewer', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue({
      id: 1,
      title: 'T',
      pinned: false,
      locked: false,
      solved: false,
      views: 0,
      authorId: 1,
      author: { name: 'A', role: 'USER' },
      category: { slug: 'general', name: 'General' },
      createdAt: new Date(),
      posts: [
        {
          id: 100,
          content: 'visible',
          solution: false,
          deleted: false,
          deletedByName: null,
          editedByName: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          author: { id: 1, name: 'Bob', role: 'USER', avatarUrl: null },
          reactions: [
            { emoji: '👍', userId: 1, user: { name: 'Bob' } },
            { emoji: '👍', userId: 2, user: { name: 'Carol' } },
          ],
        },
      ],
    });
    mockPrisma.forumThread.update.mockResolvedValue({});

    const res = mockRes();
    await getThread(
      mockReq({
        params: { threadId: '1' } as Record<string, string>,
        user: { id: 7 } as Request['user'],
      }),
      res,
      vi.fn(),
    );
    const payload = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0] as {
      posts: Array<{ reactions: Array<{ count: number; active: boolean }> }>;
    };
    expect(payload.posts[0].reactions[0]).toMatchObject({ count: 2, active: false });
  });
});

describe('createThread', () => {
  it('returns 404 for unknown category', async () => {
    mockPrisma.forumCategory.findUnique.mockResolvedValue(null);
    const next = vi.fn();
    await createThread(
      mockReq({
        user: { id: 1 } as Request['user'],
        body: { categorySlug: 'nope', title: 'T', content: 'C' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(404);
  });

  it('returns 403 for USER posting in announcements', async () => {
    mockPrisma.forumCategory.findUnique.mockResolvedValue({ id: 1, slug: 'announcements' });
    mockUserRepo.getRole.mockResolvedValue('USER');
    const next = vi.fn();
    await createThread(
      mockReq({
        user: { id: 1 } as Request['user'],
        body: { categorySlug: 'announcements', title: 'T', content: 'C' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('creates thread successfully', async () => {
    mockPrisma.forumCategory.findUnique.mockResolvedValue({ id: 1, slug: 'general' });
    mockPrisma.forumThread.create.mockResolvedValue({ id: 42 });
    const res = mockRes();
    await createThread(
      mockReq({
        user: { id: 1 } as Request['user'],
        body: { categorySlug: 'general', title: 'Hello', content: 'World' },
      }),
      res,
      vi.fn(),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ threadId: 42 });
  });

  it('lets a MODERATOR start a thread in a restricted category', async () => {
    mockPrisma.forumCategory.findUnique.mockResolvedValue({ id: 1, slug: 'announcements' });
    mockUserRepo.getRole.mockResolvedValue('MODERATOR');
    mockPrisma.forumThread.create.mockResolvedValue({ id: 7 });
    const res = mockRes();
    await createThread(
      mockReq({
        user: { id: 1 } as Request['user'],
        body: { categorySlug: 'announcements', title: 'Notice', content: 'C' },
      }),
      res,
      vi.fn(),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ threadId: 7 });
  });
});

describe('createPost', () => {
  it('returns 404 for missing thread', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue(null);
    const next = vi.fn();
    await createPost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { threadId: '1' } as Record<string, string>,
        body: { content: 'hi' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(404);
  });

  it('returns 403 for locked thread', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue({
      id: 1,
      locked: true,
      category: { slug: 'general' },
    });
    const next = vi.fn();
    await createPost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { threadId: '1' } as Record<string, string>,
        body: { content: 'hi' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('creates post successfully', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue({
      id: 1,
      locked: false,
      category: { slug: 'general' },
    });
    mockPrisma.forumPost.create.mockResolvedValue({ id: 99 });
    mockPrisma.forumThread.update.mockResolvedValue({});
    const res = mockRes();
    await createPost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { threadId: '1' } as Record<string, string>,
        body: { content: 'hi' },
      }),
      res,
      vi.fn(),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ postId: 99 });
  });

  it('returns 400 for a non-numeric thread ID', async () => {
    const next = vi.fn();
    await createPost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { threadId: 'abc' } as Record<string, string>,
        body: { content: 'hi' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it('returns 403 when a USER replies in a restricted category', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue({
      id: 1,
      locked: false,
      category: { slug: 'announcements' },
    });
    mockUserRepo.getRole.mockResolvedValue('USER');
    const next = vi.fn();
    await createPost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { threadId: '1' } as Record<string, string>,
        body: { content: 'hi' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('lets a MODERATOR reply in a restricted category', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue({
      id: 1,
      locked: false,
      category: { slug: 'announcements' },
    });
    mockUserRepo.getRole.mockResolvedValue('MODERATOR');
    mockPrisma.forumPost.create.mockResolvedValue({ id: 5 });
    mockPrisma.forumThread.update.mockResolvedValue({});
    const res = mockRes();
    await createPost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { threadId: '1' } as Record<string, string>,
        body: { content: 'hi' },
      }),
      res,
      vi.fn(),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ postId: 5 });
  });
});

describe('toggleReaction', () => {
  it('returns 404 when the post does not exist', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue(null);
    const next = vi.fn();
    await toggleReaction(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
        body: { emoji: '👍' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(404);
  });

  it('returns 403 when reacting to a deleted post', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({ deleted: true });
    const next = vi.fn();
    await toggleReaction(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
        body: { emoji: '👍' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('removes existing reaction', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({ deleted: false });
    mockPrisma.forumReaction.findUnique.mockResolvedValue({ id: 5 });
    mockPrisma.forumReaction.delete.mockResolvedValue({});
    const res = mockRes();
    await toggleReaction(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
        body: { emoji: '👍' },
      }),
      res,
      vi.fn(),
    );
    expect(res.json).toHaveBeenCalledWith({ active: false });
  });

  it('adds new reaction and notifies the post author', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({
      deleted: false,
      authorId: 9,
      threadId: 7,
      thread: { title: 'T', category: { slug: 'general' } },
    });
    mockPrisma.forumReaction.findUnique.mockResolvedValue(null);
    mockPrisma.forumReaction.create.mockResolvedValue({});
    const res = mockRes();
    await toggleReaction(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
        body: { emoji: '👍' },
      }),
      res,
      vi.fn(),
    );
    expect(res.json).toHaveBeenCalledWith({ active: true });
    expect(mockNotifications.notify).toHaveBeenCalledWith({
      recipientIds: [9],
      actorId: 1,
      type: 'FORUM_REACTION',
      entityId: 7,
      data: { title: 'T', categorySlug: 'general' },
    });
  });

  it('returns 400 for a non-numeric post ID', async () => {
    const next = vi.fn();
    await toggleReaction(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: 'abc' } as Record<string, string>,
        body: { emoji: '👍' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });
});

describe('markSolution', () => {
  it('returns 400 for a non-numeric post ID', async () => {
    const next = vi.fn();
    await markSolution(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: 'abc' } as Record<string, string>,
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it('returns 404 when the post does not exist', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue(null);
    const next = vi.fn();
    await markSolution(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(404);
  });

  it('returns 403 if not thread author', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({ id: 1, thread: { authorId: 99 } });
    const next = vi.fn();
    await markSolution(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('returns 400 when marking a deleted post as solution', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({
      id: 1,
      deleted: true,
      thread: { authorId: 1 },
    });
    const next = vi.fn();
    await markSolution(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it('marks post as solution', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({
      id: 1,
      threadId: 10,
      solution: false,
      deleted: false,
      thread: { authorId: 1, title: 'T', category: { slug: 'general' } },
    });
    mockPrisma.forumPost.updateMany.mockResolvedValue({});
    mockPrisma.forumPost.update.mockResolvedValue({});
    mockPrisma.forumThread.update.mockResolvedValue({});
    const res = mockRes();
    await markSolution(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
      }),
      res,
      vi.fn(),
    );
    expect(mockPrisma.$transaction).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ solved: true });
  });

  it('toggles the current solution off and reopens the thread', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({
      id: 1,
      threadId: 10,
      solution: true,
      deleted: false,
      thread: { authorId: 1 },
    });
    mockPrisma.forumPost.update.mockResolvedValue({});
    mockPrisma.forumThread.update.mockResolvedValue({});
    const res = mockRes();
    await markSolution(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
      }),
      res,
      vi.fn(),
    );
    expect(mockPrisma.forumPost.updateMany).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ solved: false });
  });
});

describe('updatePost', () => {
  it('returns 400 for a non-numeric post ID', async () => {
    const next = vi.fn();
    await updatePost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: 'abc' } as Record<string, string>,
        body: { content: 'x' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it('returns 404 when the post does not exist', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue(null);
    const next = vi.fn();
    await updatePost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
        body: { content: 'x' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(404);
  });

  it("returns 403 when USER tries to edit another user's post", async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({
      id: 1,
      authorId: 99,
      author: { role: 'USER' },
    });
    mockUserRepo.getRole.mockResolvedValue('USER');
    const next = vi.fn();
    await updatePost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
        body: { content: 'edited' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('allows ADMIN to edit any post', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({
      id: 1,
      authorId: 99,
      author: { role: 'MODERATOR' },
    });
    mockUserRepo.getRole.mockResolvedValue('ADMIN');
    mockPrisma.user.findUnique.mockResolvedValue({ name: 'Admin' });
    mockPrisma.forumPost.update.mockResolvedValue({});
    const res = mockRes();
    await updatePost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
        body: { content: 'edited' },
      }),
      res,
      vi.fn(),
    );
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it("allows MODERATOR to edit USER's post", async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({
      id: 1,
      authorId: 99,
      author: { role: 'USER' },
    });
    mockUserRepo.getRole.mockResolvedValue('MODERATOR');
    mockPrisma.user.findUnique.mockResolvedValue({ name: 'Mod' });
    mockPrisma.forumPost.update.mockResolvedValue({});
    const res = mockRes();
    await updatePost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
        body: { content: 'edited' },
      }),
      res,
      vi.fn(),
    );
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it("prevents MODERATOR from editing ADMIN's post", async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({
      id: 1,
      authorId: 99,
      author: { role: 'ADMIN' },
    });
    mockUserRepo.getRole.mockResolvedValue('MODERATOR');
    const next = vi.fn();
    await updatePost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
        body: { content: 'edited' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });
});

describe('deletePost', () => {
  it('soft-deletes post with actor name and redacts the notification excerpt', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({
      id: 1,
      authorId: 1,
      threadId: 7,
      deleted: false,
      content: 'some reply text',
      author: { role: 'USER' },
    });
    mockUserRepo.getRole.mockResolvedValue('USER');
    mockPrisma.user.findUnique.mockResolvedValue({ name: 'Alice' });
    mockPrisma.forumPost.update.mockResolvedValue({});
    const res = mockRes();
    await deletePost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
      }),
      res,
      vi.fn(),
    );
    expect(mockPrisma.forumPost.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { deleted: true, deletedByName: 'Alice', content: '' },
      }),
    );
    expect(mockNotifications.redactExcerpt).toHaveBeenCalledWith('FORUM_REPLY', 7, 1);
    expect(res.json).toHaveBeenCalledWith({ ok: true, threadDeleted: false });
  });

  it('does not redact again for an already-deleted post', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({
      id: 1,
      authorId: 1,
      threadId: 7,
      deleted: true,
      content: '',
      author: { role: 'USER' },
    });
    mockUserRepo.getRole.mockResolvedValue('USER');
    mockPrisma.user.findUnique.mockResolvedValue({ name: 'Alice' });
    mockPrisma.forumPost.update.mockResolvedValue({});
    await deletePost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
      }),
      mockRes(),
      vi.fn(),
    );
    expect(mockNotifications.redactExcerpt).not.toHaveBeenCalled();
  });
});

describe('deleteThread', () => {
  it('returns 404 for missing thread', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue(null);
    const next = vi.fn();
    await deleteThread(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { threadId: '1' } as Record<string, string>,
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(404);
  });

  it('deletes thread by owner', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue({
      id: 1,
      authorId: 1,
      author: { role: 'USER' },
    });
    mockUserRepo.getRole.mockResolvedValue('USER');
    mockPrisma.forumThread.delete.mockResolvedValue({});
    const res = mockRes();
    await deleteThread(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { threadId: '1' } as Record<string, string>,
      }),
      res,
      vi.fn(),
    );
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
});

describe('updateUserRole', () => {
  it('returns 403 for non-admin', async () => {
    mockUserRepo.getRole.mockResolvedValue('MODERATOR');
    const next = vi.fn();
    await updateUserRole(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { userId: '2' } as Record<string, string>,
        body: { role: 'MODERATOR' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('returns 400 for a non-numeric user ID', async () => {
    mockUserRepo.getRole.mockResolvedValue('ADMIN');
    const next = vi.fn();
    await updateUserRole(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { userId: 'abc' } as Record<string, string>,
        body: { role: 'MODERATOR' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it('returns 400 when admin tries to change own role', async () => {
    mockUserRepo.getRole.mockResolvedValue('ADMIN');
    const next = vi.fn();
    await updateUserRole(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { userId: '1' } as Record<string, string>,
        body: { role: 'USER' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it('updates role successfully', async () => {
    mockUserRepo.getRole.mockResolvedValueOnce('ADMIN').mockResolvedValueOnce('USER');
    mockUserRepo.updateRole.mockResolvedValue(undefined);
    const res = mockRes();
    await updateUserRole(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { userId: '2' } as Record<string, string>,
        body: { role: 'MODERATOR' },
      }),
      res,
      vi.fn(),
    );
    expect(mockUserRepo.updateRole).toHaveBeenCalledWith(2, 'MODERATOR');
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it('blocks a plain admin from promoting to admin', async () => {
    mockUserRepo.getRole.mockResolvedValueOnce('ADMIN').mockResolvedValueOnce('USER');
    const next = vi.fn();
    await updateUserRole(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { userId: '2' } as Record<string, string>,
        body: { role: 'ADMIN' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
    expect(mockUserRepo.updateRole).not.toHaveBeenCalled();
  });

  it('blocks a plain admin from demoting another admin', async () => {
    mockUserRepo.getRole.mockResolvedValueOnce('ADMIN').mockResolvedValueOnce('ADMIN');
    const next = vi.fn();
    await updateUserRole(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { userId: '2' } as Record<string, string>,
        body: { role: 'USER' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
    expect(mockUserRepo.updateRole).not.toHaveBeenCalled();
  });

  it('blocks anyone from modifying the founder', async () => {
    mockUserRepo.getRole.mockResolvedValueOnce('ADMIN').mockResolvedValueOnce('FOUNDER');
    const next = vi.fn();
    await updateUserRole(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { userId: '2' } as Record<string, string>,
        body: { role: 'USER' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
    expect(mockUserRepo.updateRole).not.toHaveBeenCalled();
  });

  it('lets the founder promote a user to admin', async () => {
    mockUserRepo.getRole.mockResolvedValueOnce('FOUNDER').mockResolvedValueOnce('USER');
    mockUserRepo.updateRole.mockResolvedValue(undefined);
    const res = mockRes();
    await updateUserRole(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { userId: '2' } as Record<string, string>,
        body: { role: 'ADMIN' },
      }),
      res,
      vi.fn(),
    );
    expect(mockUserRepo.updateRole).toHaveBeenCalledWith(2, 'ADMIN');
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it('lets the founder demote an admin', async () => {
    mockUserRepo.getRole.mockResolvedValueOnce('FOUNDER').mockResolvedValueOnce('ADMIN');
    mockUserRepo.updateRole.mockResolvedValue(undefined);
    const res = mockRes();
    await updateUserRole(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { userId: '2' } as Record<string, string>,
        body: { role: 'USER' },
      }),
      res,
      vi.fn(),
    );
    expect(mockUserRepo.updateRole).toHaveBeenCalledWith(2, 'USER');
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
});

describe('deletePost authorization', () => {
  it('returns 404 for missing post', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue(null);
    const next = vi.fn();
    await deletePost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(404);
  });

  it('returns 403 when user is neither owner nor moderator', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({
      id: 1,
      authorId: 99,
      author: { role: 'USER' },
    });
    mockUserRepo.getRole.mockResolvedValue('USER');
    const next = vi.fn();
    await deletePost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: '1' } as Record<string, string>,
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('returns 400 for non-numeric postId', async () => {
    const next = vi.fn();
    await deletePost(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { postId: 'abc' } as Record<string, string>,
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });
});

describe('deleteThread authorization', () => {
  it('returns 403 when user is neither owner nor moderator', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue({
      id: 1,
      authorId: 99,
      author: { role: 'USER' },
    });
    mockUserRepo.getRole.mockResolvedValue('USER');
    const next = vi.fn();
    await deleteThread(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { threadId: '1' } as Record<string, string>,
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('returns 400 for non-numeric threadId', async () => {
    const next = vi.fn();
    await deleteThread(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { threadId: 'abc' } as Record<string, string>,
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });
});

describe('createCategory', () => {
  it('returns 403 for a plain USER', async () => {
    mockUserRepo.getRole.mockResolvedValue('USER');
    const next = vi.fn();
    await createCategory(
      mockReq({
        user: { id: 1 } as Request['user'],
        body: { name: 'X', description: 'd', icon: '💬', color: '#6C5CE7', groupName: 'G' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('creates a category with a slug derived from the name', async () => {
    mockUserRepo.getRole.mockResolvedValue('MODERATOR');
    mockPrisma.forumCategory.findUnique.mockResolvedValue(null);
    mockPrisma.forumCategory.aggregate.mockResolvedValue({ _max: { sortOrder: 4 } });
    mockPrisma.forumCategory.create.mockResolvedValue({ slug: 'python-help' });
    const res = mockRes();
    await createCategory(
      mockReq({
        user: { id: 1 } as Request['user'],
        body: {
          name: 'Python Help!',
          description: 'd',
          icon: '🐍',
          color: '#6C5CE7',
          groupName: 'Help',
        },
      }),
      res,
      vi.fn(),
    );
    const createArg = mockPrisma.forumCategory.create.mock.calls[0][0];
    expect(createArg.data.slug).toBe('python-help');
    expect(createArg.data.sortOrder).toBe(5);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ slug: 'python-help' });
  });

  it('appends a numeric suffix when the slug already exists', async () => {
    mockUserRepo.getRole.mockResolvedValue('ADMIN');
    mockPrisma.forumCategory.findUnique
      .mockResolvedValueOnce({ slug: 'general' })
      .mockResolvedValueOnce(null);
    mockPrisma.forumCategory.aggregate.mockResolvedValue({ _max: { sortOrder: null } });
    mockPrisma.forumCategory.create.mockResolvedValue({ slug: 'general-2' });
    const res = mockRes();
    await createCategory(
      mockReq({
        user: { id: 1 } as Request['user'],
        body: { name: 'General', description: 'd', icon: '💬', color: '#ffffff', groupName: 'G' },
      }),
      res,
      vi.fn(),
    );
    const createArg = mockPrisma.forumCategory.create.mock.calls[0][0];
    expect(createArg.data.slug).toBe('general-2');
    expect(createArg.data.sortOrder).toBe(1);
    expect(res.json).toHaveBeenCalledWith({ slug: 'general-2' });
  });
});

describe('updateCategory', () => {
  it('returns 403 for a plain USER', async () => {
    mockUserRepo.getRole.mockResolvedValue('USER');
    const next = vi.fn();
    await updateCategory(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { categorySlug: 'general' } as Record<string, string>,
        body: { name: 'X', description: 'd', icon: '💬', color: '#6C5CE7', groupName: 'G' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('returns 404 when the category is missing', async () => {
    mockUserRepo.getRole.mockResolvedValue('ADMIN');
    mockPrisma.forumCategory.findUnique.mockResolvedValue(null);
    const next = vi.fn();
    await updateCategory(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { categorySlug: 'nope' } as Record<string, string>,
        body: { name: 'X', description: 'd', icon: '💬', color: '#6C5CE7', groupName: 'G' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(404);
  });

  it('updates an existing category', async () => {
    mockUserRepo.getRole.mockResolvedValue('MODERATOR');
    mockPrisma.forumCategory.findUnique.mockResolvedValue({ slug: 'general' });
    mockPrisma.forumCategory.update.mockResolvedValue({});
    const res = mockRes();
    await updateCategory(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { categorySlug: 'general' } as Record<string, string>,
        body: { name: 'New', description: 'd', icon: '✨', color: '#000000', groupName: 'G' },
      }),
      res,
      vi.fn(),
    );
    expect(mockPrisma.forumCategory.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { slug: 'general' } }),
    );
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
});

describe('deleteCategory', () => {
  it('returns 403 for a plain USER', async () => {
    mockUserRepo.getRole.mockResolvedValue('USER');
    const next = vi.fn();
    await deleteCategory(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { categorySlug: 'general' } as Record<string, string>,
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('returns 404 when the category is missing', async () => {
    mockUserRepo.getRole.mockResolvedValue('ADMIN');
    mockPrisma.forumCategory.findUnique.mockResolvedValue(null);
    const next = vi.fn();
    await deleteCategory(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { categorySlug: 'nope' } as Record<string, string>,
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(404);
  });

  it('deletes an existing category (cascading its threads)', async () => {
    mockUserRepo.getRole.mockResolvedValue('ADMIN');
    mockPrisma.forumCategory.findUnique.mockResolvedValue({ slug: 'general' });
    mockPrisma.forumCategory.delete.mockResolvedValue({});
    const res = mockRes();
    await deleteCategory(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { categorySlug: 'general' } as Record<string, string>,
      }),
      res,
      vi.fn(),
    );
    expect(mockPrisma.forumCategory.delete).toHaveBeenCalledWith({ where: { slug: 'general' } });
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
});
