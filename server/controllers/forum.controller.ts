import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import type { Role } from "@prisma/client";
import { AppError } from "../middleware/errorHandler.js";
import * as userRepo from "../repositories/user.repository.js";
import type {
  ForumCategoryDTO,
  ForumThreadSummaryDTO,
  ForumThreadDetailDTO,
  ForumPostDTO,
  ForumReactionGroupDTO,
} from "../../shared/forum.js";

const prisma = new PrismaClient();

// Categories where only moderators and admins may start threads or reply.
const RESTRICTED_CATEGORIES = new Set(["announcements"]);

/**
 * Whether an actor may edit/delete content authored by someone else.
 * - ADMIN: anything.
 * - MODERATOR: own content, or content by a plain USER (not other mods/admins).
 * - USER: only their own content.
 */
function canModerate(actorRole: Role, targetRole: Role, isOwner: boolean): boolean {
  if (actorRole === "ADMIN") return true;
  if (actorRole === "MODERATOR") return isOwner || targetRole === "USER";
  return isOwner;
}

export async function getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await prisma.forumCategory.findMany({ orderBy: { sortOrder: "asc" } });

    const result: ForumCategoryDTO[] = await Promise.all(
      categories.map(async (cat) => {
        const threadCount = await prisma.forumThread.count({ where: { categoryId: cat.id } });
        const postCount = await prisma.forumPost.count({
          where: { thread: { categoryId: cat.id } },
        });

        const lastPost = await prisma.forumPost.findFirst({
          where: { thread: { categoryId: cat.id } },
          orderBy: { createdAt: "desc" },
          include: { thread: true, author: { select: { name: true } } },
        });

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
          lastPost: lastPost
            ? {
                threadTitle: lastPost.thread.title,
                authorName: lastPost.author.name,
                createdAt: lastPost.createdAt.toISOString(),
              }
            : null,
        };
      })
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getThreads(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categorySlug = req.params.categorySlug as string;

    const category = await prisma.forumCategory.findUnique({ where: { slug: categorySlug } });
    if (!category) throw new AppError(404, "Category not found");

    const threads = await prisma.forumThread.findMany({
      where: { categoryId: category.id },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
      include: {
        author: { select: { name: true, role: true } },
        posts: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { author: { select: { name: true } } },
        },
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

    res.json({ category: { slug: category.slug, name: category.name, description: category.description, icon: category.icon, color: category.color }, threads: result });
  } catch (err) {
    next(err);
  }
}

export async function getThread(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const threadId = parseInt(req.params.threadId as string);
    if (isNaN(threadId)) throw new AppError(400, "Invalid thread ID");

    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId },
      include: {
        category: true,
        author: { select: { name: true, role: true } },
        posts: {
          orderBy: { createdAt: "asc" },
          include: {
            author: { select: { id: true, name: true, role: true } },
            reactions: true,
          },
        },
      },
    });

    if (!thread) throw new AppError(404, "Thread not found");

    await prisma.forumThread.update({ where: { id: threadId }, data: { views: { increment: 1 } } });

    const userId = req.user?.id;

    const posts: ForumPostDTO[] = thread.posts.map((p) => {
      const reactionMap = new Map<string, { count: number; active: boolean }>();
      for (const r of p.reactions) {
        const existing = reactionMap.get(r.emoji);
        if (existing) {
          existing.count++;
          if (r.userId === userId) existing.active = true;
        } else {
          reactionMap.set(r.emoji, { count: 1, active: r.userId === userId });
        }
      }
      const reactions: ForumReactionGroupDTO[] = Array.from(reactionMap.entries()).map(
        ([emoji, data]) => ({ emoji, ...data })
      );

      return {
        id: p.id,
        content: p.content,
        solution: p.solution,
        authorId: p.author.id,
        authorName: p.author.name,
        authorRole: p.author.role,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        reactions,
      };
    });

    const result: ForumThreadDetailDTO = {
      id: thread.id,
      title: thread.title,
      pinned: thread.pinned,
      locked: thread.locked,
      solved: thread.solved,
      views: thread.views + 1,
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

    if (!categorySlug || !title?.trim() || !content?.trim()) {
      throw new AppError(400, "categorySlug, title, and content are required");
    }

    const category = await prisma.forumCategory.findUnique({ where: { slug: categorySlug } });
    if (!category) throw new AppError(404, "Category not found");

    if (RESTRICTED_CATEGORIES.has(category.slug)) {
      const role = await userRepo.getRole(userId);
      if (role === "USER") {
        throw new AppError(403, "Only moderators and admins can post in this category");
      }
    }

    const thread = await prisma.forumThread.create({
      data: {
        categoryId: category.id,
        authorId: userId,
        title: title.trim(),
        posts: {
          create: { authorId: userId, content: content.trim() },
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
    if (isNaN(threadId)) throw new AppError(400, "Invalid thread ID");

    const { content } = req.body;
    if (!content?.trim()) throw new AppError(400, "Content is required");

    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId },
      include: { category: true },
    });
    if (!thread) throw new AppError(404, "Thread not found");
    if (thread.locked) throw new AppError(403, "Thread is locked");

    if (RESTRICTED_CATEGORIES.has(thread.category.slug)) {
      const role = await userRepo.getRole(userId);
      if (role === "USER") {
        throw new AppError(403, "Only moderators and admins can post in this category");
      }
    }

    const post = await prisma.forumPost.create({
      data: { threadId, authorId: userId, content: content.trim() },
    });

    await prisma.forumThread.update({ where: { id: threadId }, data: { updatedAt: new Date() } });

    res.status(201).json({ postId: post.id });
  } catch (err) {
    next(err);
  }
}

export async function toggleReaction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const postId = parseInt(req.params.postId as string);
    if (isNaN(postId)) throw new AppError(400, "Invalid post ID");

    const { emoji } = req.body;
    if (!emoji) throw new AppError(400, "Emoji is required");

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
    if (isNaN(postId)) throw new AppError(400, "Invalid post ID");

    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: { thread: true },
    });

    if (!post) throw new AppError(404, "Post not found");
    if (post.thread.authorId !== userId) throw new AppError(403, "Only the thread author can mark a solution");

    await prisma.forumPost.updateMany({
      where: { threadId: post.threadId },
      data: { solution: false },
    });

    await prisma.forumPost.update({ where: { id: postId }, data: { solution: true } });
    await prisma.forumThread.update({ where: { id: post.threadId }, data: { solved: true } });

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const postId = parseInt(req.params.postId as string);
    if (isNaN(postId)) throw new AppError(400, "Invalid post ID");

    const { content } = req.body;
    if (!content?.trim()) throw new AppError(400, "Content is required");

    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: { author: { select: { role: true } } },
    });
    if (!post) throw new AppError(404, "Post not found");

    const actorRole = await userRepo.getRole(userId);
    if (!canModerate(actorRole, post.author.role, post.authorId === userId)) {
      throw new AppError(403, "You cannot edit this post");
    }

    await prisma.forumPost.update({ where: { id: postId }, data: { content: content.trim() } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const postId = parseInt(req.params.postId as string);
    if (isNaN(postId)) throw new AppError(400, "Invalid post ID");

    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: { author: { select: { role: true } } },
    });
    if (!post) throw new AppError(404, "Post not found");

    const actorRole = await userRepo.getRole(userId);
    if (!canModerate(actorRole, post.author.role, post.authorId === userId)) {
      throw new AppError(403, "You cannot delete this post");
    }

    await prisma.forumPost.delete({ where: { id: postId } });

    // A thread left with no posts is removed entirely.
    const remaining = await prisma.forumPost.count({ where: { threadId: post.threadId } });
    if (remaining === 0) {
      await prisma.forumThread.delete({ where: { id: post.threadId } });
    }

    res.json({ ok: true, threadDeleted: remaining === 0 });
  } catch (err) {
    next(err);
  }
}

export async function deleteThread(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const threadId = parseInt(req.params.threadId as string);
    if (isNaN(threadId)) throw new AppError(400, "Invalid thread ID");

    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId },
      include: { author: { select: { role: true } } },
    });
    if (!thread) throw new AppError(404, "Thread not found");

    const actorRole = await userRepo.getRole(userId);
    if (!canModerate(actorRole, thread.author.role, thread.authorId === userId)) {
      throw new AppError(403, "You cannot delete this thread");
    }

    await prisma.forumThread.delete({ where: { id: threadId } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const actorId = req.user!.id;
    const actorRole = await userRepo.getRole(actorId);
    if (actorRole !== "ADMIN") throw new AppError(403, "Only admins can change roles");

    const targetId = parseInt(req.params.userId as string);
    if (isNaN(targetId)) throw new AppError(400, "Invalid user ID");
    if (targetId === actorId) throw new AppError(400, "You cannot change your own role");

    const role = req.body.role as Role;
    if (!["USER", "MODERATOR", "ADMIN"].includes(role)) {
      throw new AppError(400, "Invalid role");
    }

    await userRepo.updateRole(targetId, role);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
