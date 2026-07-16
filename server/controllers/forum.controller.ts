import type { Request, Response, NextFunction } from 'express';
import type { Role } from '@prisma/client';
import { prisma } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import * as userRepo from '../repositories/user.repository.js';
import { RESTRICTED_FORUM_CATEGORIES } from '../../shared/constants.js';
import type {
  ForumCategoryDTO,
  ForumThreadSummaryDTO,
  ForumThreadDetailDTO,
  ForumPostDTO,
  ForumReactionGroupDTO,
} from '../../shared/forum.js';

/**
 * Whether an actor may edit/delete content authored by someone else.
 * - ADMIN: anything.
 * - MODERATOR: own content, or content by a plain USER (not other mods/admins).
 * - USER: only their own content.
 */
function canModerate(actorRole: Role, targetRole: Role, isOwner: boolean): boolean {
  if (actorRole === 'ADMIN') return true;
  if (actorRole === 'MODERATOR') return isOwner || targetRole === 'USER';
  return isOwner;
}

/** Only moderators and admins may create/edit/delete forum categories. */
function requireStaff(role: Role): void {
  if (role !== 'ADMIN' && role !== 'MODERATOR') {
    throw new AppError(403, 'Only moderators and admins can manage categories');
  }
}

/** Derive a URL-safe, <=50-char slug from a category name. */
function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
    .replace(/-+$/, '');
  return base || 'category';
}

export async function getCategories(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categories = await prisma.forumCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        threads: {
          select: {
            id: true,
            title: true,
            posts: {
              where: { deleted: false },
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: { createdAt: true, author: { select: { name: true } } },
            },
            _count: { select: { posts: true } },
          },
        },
      },
    });

    const result: ForumCategoryDTO[] = categories.map((cat) => {
      const threadCount = cat.threads.length;
      const postCount = cat.threads.reduce((sum, t) => sum + t._count.posts, 0);

      let lastPost: ForumCategoryDTO['lastPost'] = null;
      let latestDate: Date | null = null;
      for (const t of cat.threads) {
        const p = t.posts[0];
        if (p && (!latestDate || p.createdAt > latestDate)) {
          latestDate = p.createdAt;
          lastPost = {
            threadTitle: t.title,
            authorName: p.author.name,
            createdAt: p.createdAt.toISOString(),
          };
        }
      }

      return {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        groupName: cat.groupName,
        threadCount,
        postCount,
        lastPost,
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getThreads(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categorySlug = req.params.categorySlug as string;

    const category = await prisma.forumCategory.findUnique({ where: { slug: categorySlug } });
    if (!category) throw new AppError(404, 'Category not found');

    const threads = await prisma.forumThread.findMany({
      where: { categoryId: category.id },
      orderBy: [{ pinned: 'desc' }, { updatedAt: 'desc' }],
      include: {
        author: { select: { name: true, role: true } },
        posts: {
          where: { deleted: false },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { author: { select: { name: true } } },
        },
        // Count every post (incl. soft-deleted tombstones, which still render as
        // slots in the thread) so replyCount matches getCategories' postCount and
        // never undercounts when the opening post itself was deleted.
        _count: { select: { posts: true } },
      },
    });

    const result: ForumThreadSummaryDTO[] = threads.map((t) => ({
      id: t.id,
      title: t.title,
      pinned: t.pinned,
      locked: t.locked,
      solved: t.solved,
      views: t.views,
      authorName: t.author.name,
      authorId: t.authorId,
      authorRole: t.author.role,
      replyCount: Math.max(0, t._count.posts - 1),
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      lastPostAuthor: t.posts[0]?.author.name ?? null,
      lastPostAt: t.posts[0]?.createdAt.toISOString() ?? null,
    }));

    res.json({
      category: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        icon: category.icon,
        color: category.color,
      },
      threads: result,
    });
  } catch (err) {
    next(err);
  }
}

const VIEW_DEDUP_MS = 24 * 60 * 60 * 1000;

/**
 * Count a thread view at most once per viewer per 24h, and never for the thread's
 * own author. Viewers are keyed by user id (logged in) or the per-browser guestId
 * cookie. Returns whether the view counter was incremented.
 */
async function countThreadView(
  threadId: number,
  userId: number | undefined,
  authorId: number,
  guestId: string | undefined,
): Promise<boolean> {
  if (userId != null && userId === authorId) return false;
  const viewerKey = userId != null ? `user:${userId}` : guestId ? `guest:${guestId}` : null;
  if (!viewerKey) return false;

  const now = new Date();
  const existing = await prisma.forumThreadView.findUnique({
    where: { threadId_viewerKey: { threadId, viewerKey } },
  });
  if (existing && now.getTime() - existing.viewedAt.getTime() < VIEW_DEDUP_MS) return false;

  if (existing) {
    await prisma.forumThreadView.update({ where: { id: existing.id }, data: { viewedAt: now } });
  } else {
    await prisma.forumThreadView.create({ data: { threadId, viewerKey, viewedAt: now } });
  }
  await prisma.forumThread.update({ where: { id: threadId }, data: { views: { increment: 1 } } });
  return true;
}

export async function getThread(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const threadId = parseInt(req.params.threadId as string);
    if (isNaN(threadId)) throw new AppError(400, 'Invalid thread ID');

    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId },
      include: {
        category: true,
        author: { select: { name: true, role: true } },
        posts: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: { select: { id: true, name: true, role: true, avatarUrl: true } },
            reactions: { include: { user: { select: { name: true } } } },
          },
        },
      },
    });

    if (!thread) throw new AppError(404, 'Thread not found');

    const userId = req.user?.id;
    const counted = await countThreadView(threadId, userId, thread.authorId, req.cookies?.guestId);

    const posts: ForumPostDTO[] = thread.posts.map((p) => {
      const reactionMap = new Map<string, { count: number; active: boolean; users: string[] }>();
      for (const r of p.reactions as Array<
        (typeof p.reactions)[number] & { user: { name: string } }
      >) {
        const existing = reactionMap.get(r.emoji);
        if (existing) {
          existing.count++;
          existing.users.push(r.user.name);
          if (r.userId === userId) existing.active = true;
        } else {
          reactionMap.set(r.emoji, { count: 1, active: r.userId === userId, users: [r.user.name] });
        }
      }
      const reactions: ForumReactionGroupDTO[] = Array.from(reactionMap.entries()).map(
        ([emoji, data]) => ({ emoji, ...data }),
      );

      return {
        id: p.id,
        content: p.deleted ? '' : p.content,
        solution: p.solution,
        authorId: p.author.id,
        authorName: p.author.name,
        authorAvatarUrl: p.author.avatarUrl,
        authorRole: p.author.role,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        editedByName: p.editedByName,
        deleted: p.deleted,
        deletedByName: p.deletedByName,
        reactions,
      };
    });

    const result: ForumThreadDetailDTO = {
      id: thread.id,
      title: thread.title,
      pinned: thread.pinned,
      locked: thread.locked,
      solved: thread.solved,
      views: thread.views + (counted ? 1 : 0),
      categorySlug: thread.category.slug,
      categoryName: thread.category.name,
      authorName: thread.author.name,
      authorId: thread.authorId,
      authorRole: thread.author.role,
      createdAt: thread.createdAt.toISOString(),
      posts,
    };

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function createThread(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { categorySlug, title, content } = req.body;

    const category = await prisma.forumCategory.findUnique({ where: { slug: categorySlug } });
    if (!category) throw new AppError(404, 'Category not found');

    if (RESTRICTED_FORUM_CATEGORIES.has(category.slug)) {
      const role = await userRepo.getRole(userId);
      if (role === 'USER') {
        throw new AppError(403, 'Only moderators and admins can post in this category');
      }
    }

    const thread = await prisma.forumThread.create({
      data: {
        categoryId: category.id,
        authorId: userId,
        title,
        posts: {
          create: { authorId: userId, content },
        },
      },
    });

    res.status(201).json({ threadId: thread.id });
  } catch (err) {
    next(err);
  }
}

export async function createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const threadId = parseInt(req.params.threadId as string);
    if (isNaN(threadId)) throw new AppError(400, 'Invalid thread ID');

    const { content } = req.body;

    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId },
      include: { category: true },
    });
    if (!thread) throw new AppError(404, 'Thread not found');
    if (thread.locked) throw new AppError(403, 'Thread is locked');

    if (RESTRICTED_FORUM_CATEGORIES.has(thread.category.slug)) {
      const role = await userRepo.getRole(userId);
      if (role === 'USER') {
        throw new AppError(403, 'Only moderators and admins can post in this category');
      }
    }

    const post = await prisma.forumPost.create({
      data: { threadId, authorId: userId, content },
    });

    await prisma.forumThread.update({ where: { id: threadId }, data: { updatedAt: new Date() } });

    res.status(201).json({ postId: post.id });
  } catch (err) {
    next(err);
  }
}

export async function toggleReaction(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    const postId = parseInt(req.params.postId as string);
    if (isNaN(postId)) throw new AppError(400, 'Invalid post ID');

    const { emoji } = req.body;

    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      select: { deleted: true },
    });
    if (!post) throw new AppError(404, 'Post not found');
    if (post.deleted) throw new AppError(403, 'Cannot react to a deleted post');

    const existing = await prisma.forumReaction.findUnique({
      where: { postId_userId_emoji: { postId, userId, emoji } },
    });

    if (existing) {
      await prisma.forumReaction.delete({ where: { id: existing.id } });
      res.json({ active: false });
    } else {
      await prisma.forumReaction.create({ data: { postId, userId, emoji } });
      res.json({ active: true });
    }
  } catch (err) {
    next(err);
  }
}

export async function markSolution(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const postId = parseInt(req.params.postId as string);
    if (isNaN(postId)) throw new AppError(400, 'Invalid post ID');

    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: { thread: true },
    });

    if (!post) throw new AppError(404, 'Post not found');
    if (post.deleted) throw new AppError(400, 'Cannot mark a deleted post as solution');
    if (post.thread.authorId !== userId)
      throw new AppError(403, 'Only the thread author can mark a solution');

    // Toggle: re-marking the current solution clears it and reopens the thread,
    // so the author can pick a different answer or unset it entirely.
    if (post.solution) {
      await prisma.$transaction([
        prisma.forumPost.update({ where: { id: postId }, data: { solution: false } }),
        prisma.forumThread.update({ where: { id: post.threadId }, data: { solved: false } }),
      ]);
      res.json({ solved: false });
      return;
    }

    await prisma.$transaction([
      prisma.forumPost.updateMany({
        where: { threadId: post.threadId },
        data: { solution: false },
      }),
      prisma.forumPost.update({ where: { id: postId }, data: { solution: true } }),
      prisma.forumThread.update({ where: { id: post.threadId }, data: { solved: true } }),
    ]);

    res.json({ solved: true });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const postId = parseInt(req.params.postId as string);
    if (isNaN(postId)) throw new AppError(400, 'Invalid post ID');

    const { content } = req.body;

    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: { author: { select: { role: true } } },
    });
    if (!post) throw new AppError(404, 'Post not found');

    const actorRole = await userRepo.getRole(userId);
    if (!canModerate(actorRole, post.author.role, post.authorId === userId)) {
      throw new AppError(403, 'You cannot edit this post');
    }

    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
    await prisma.forumPost.update({
      where: { id: postId },
      data: { content, editedByName: actor!.name },
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const postId = parseInt(req.params.postId as string);
    if (isNaN(postId)) throw new AppError(400, 'Invalid post ID');

    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: { author: { select: { role: true } } },
    });
    if (!post) throw new AppError(404, 'Post not found');

    const actorRole = await userRepo.getRole(userId);
    if (!canModerate(actorRole, post.author.role, post.authorId === userId)) {
      throw new AppError(403, 'You cannot delete this post');
    }

    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
    await prisma.forumPost.update({
      where: { id: postId },
      data: { deleted: true, deletedByName: actor!.name, content: '' },
    });

    res.json({ ok: true, threadDeleted: false });
  } catch (err) {
    next(err);
  }
}

export async function deleteThread(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const threadId = parseInt(req.params.threadId as string);
    if (isNaN(threadId)) throw new AppError(400, 'Invalid thread ID');

    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId },
      include: { author: { select: { role: true } } },
    });
    if (!thread) throw new AppError(404, 'Thread not found');

    const actorRole = await userRepo.getRole(userId);
    if (!canModerate(actorRole, thread.author.role, thread.authorId === userId)) {
      throw new AppError(403, 'You cannot delete this thread');
    }

    await prisma.forumThread.delete({ where: { id: threadId } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actorId = req.user!.id;
    const actorRole = await userRepo.getRole(actorId);
    if (actorRole !== 'ADMIN') throw new AppError(403, 'Only admins can change roles');

    const targetId = parseInt(req.params.userId as string);
    if (isNaN(targetId)) throw new AppError(400, 'Invalid user ID');
    if (targetId === actorId) throw new AppError(400, 'You cannot change your own role');

    const role = req.body.role as Role;
    // Don't let the platform be left with zero admins.
    if (role !== 'ADMIN' && (await userRepo.getRole(targetId)) === 'ADMIN') {
      const adminCount = await userRepo.countByRole('ADMIN');
      if (adminCount <= 1) throw new AppError(400, 'Cannot demote the last remaining admin');
    }
    await userRepo.updateRole(targetId, role);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    requireStaff(await userRepo.getRole(req.user!.id));

    const { name, description, icon, color, groupName } = req.body;

    // Derive a unique slug from the name (append -2, -3… on collision).
    const base = slugify(name);
    let slug = base;
    for (let n = 2; await prisma.forumCategory.findUnique({ where: { slug } }); n++) {
      const suffix = `-${n}`;
      slug = base.slice(0, 50 - suffix.length) + suffix;
    }

    const max = await prisma.forumCategory.aggregate({ _max: { sortOrder: true } });
    const category = await prisma.forumCategory.create({
      data: {
        slug,
        name,
        description,
        icon,
        color,
        groupName,
        sortOrder: (max._max.sortOrder ?? 0) + 1,
      },
    });

    res.status(201).json({ slug: category.slug });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    requireStaff(await userRepo.getRole(req.user!.id));

    const slug = req.params.categorySlug as string;
    const existing = await prisma.forumCategory.findUnique({ where: { slug } });
    if (!existing) throw new AppError(404, 'Category not found');

    const { name, description, icon, color, groupName } = req.body;
    await prisma.forumCategory.update({
      where: { slug },
      data: { name, description, icon, color, groupName },
    });

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    requireStaff(await userRepo.getRole(req.user!.id));

    const slug = req.params.categorySlug as string;
    const existing = await prisma.forumCategory.findUnique({ where: { slug } });
    if (!existing) throw new AppError(404, 'Category not found');

    // Threads/posts cascade-delete via the schema relation.
    await prisma.forumCategory.delete({ where: { slug } });

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
