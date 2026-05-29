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
  user: {
    findUnique: vi.fn(),
  },
  $transaction: vi.fn((ops) => Promise.all(ops)),
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const mockUserRepo = {
  getRole: vi.fn(),
  updateRole: vi.fn(),
};
vi.mock('../repositories/user.repository.js', () => mockUserRepo);

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

  it('returns thread detail and increments views', async () => {
    mockPrisma.forumThread.findUnique.mockResolvedValue({
      id: 1,
      title: 'T',
      pinned: false,
      locked: false,
      solved: false,
      views: 5,
      authorId: 1,
      author: { name: 'A', role: 'USER' },
      category: { slug: 'general', name: 'General' },
      createdAt: new Date(),
      posts: [],
    });
    mockPrisma.forumThread.update.mockResolvedValue({});

    const res = mockRes();
    await getThread(mockReq({ params: { threadId: '1' } as Record<string, string> }), res, vi.fn());
    expect(mockPrisma.forumThread.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 }, data: { views: { increment: 1 } } }),
    );
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1, views: 6 }));
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
});

describe('createThread', () => {
  it('returns 400 for missing fields', async () => {
    const next = vi.fn();
    await createThread(mockReq({ user: { id: 1 } as Request['user'], body: {} }), mockRes(), next);
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

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
});

describe('toggleReaction', () => {
  it('removes existing reaction', async () => {
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

  it('adds new reaction', async () => {
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
  });
});

describe('markSolution', () => {
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

  it('marks post as solution', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({
      id: 1,
      threadId: 10,
      thread: { authorId: 1 },
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
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
});

describe('updatePost', () => {
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
  it('soft-deletes post with actor name', async () => {
    mockPrisma.forumPost.findUnique.mockResolvedValue({
      id: 1,
      authorId: 1,
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
    expect(res.json).toHaveBeenCalledWith({ ok: true, threadDeleted: false });
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

  it('returns 400 for invalid role', async () => {
    mockUserRepo.getRole.mockResolvedValue('ADMIN');
    const next = vi.fn();
    await updateUserRole(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { userId: '2' } as Record<string, string>,
        body: { role: 'SUPERADMIN' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it('updates role successfully', async () => {
    mockUserRepo.getRole.mockResolvedValue('ADMIN');
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
});

describe('createThread validation', () => {
  it('returns 400 when categorySlug is missing', async () => {
    const next = vi.fn();
    await createThread(
      mockReq({
        user: { id: 1 } as Request['user'],
        body: { title: 'T', content: 'C' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it('returns 400 when title is whitespace only', async () => {
    const next = vi.fn();
    await createThread(
      mockReq({
        user: { id: 1 } as Request['user'],
        body: { categorySlug: 'general', title: '   ', content: 'C' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });

  it('returns 400 when content is whitespace only', async () => {
    const next = vi.fn();
    await createThread(
      mockReq({
        user: { id: 1 } as Request['user'],
        body: { categorySlug: 'general', title: 'T', content: '   ' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
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
