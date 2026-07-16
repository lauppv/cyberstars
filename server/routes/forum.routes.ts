import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  createThreadSchema,
  createPostSchema,
  updatePostSchema,
  toggleReactionSchema,
  updateUserRoleSchema,
  categorySchema,
} from '../schemas/forum.schema.js';
import * as forumController from '../controllers/forum.controller.js';

const forumWriteLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 10,
});

// getThread increments the view counter on every GET; cap it per-IP so the
// counter can't be inflated by hammering the endpoint (audit H7).
const forumReadLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 100_000 : 120,
});

const router = Router();

router.get('/categories', forumController.getCategories);
router.get('/categories/:categorySlug/threads', forumController.getThreads);

router.post(
  '/categories',
  authenticateToken,
  forumWriteLimiter,
  validateBody(categorySchema),
  forumController.createCategory,
);
router.put(
  '/categories/:categorySlug',
  authenticateToken,
  forumWriteLimiter,
  validateBody(categorySchema),
  forumController.updateCategory,
);
router.delete('/categories/:categorySlug', authenticateToken, forumController.deleteCategory);
router.get('/threads/:threadId', forumReadLimiter, optionalAuth, forumController.getThread);

router.post(
  '/threads',
  authenticateToken,
  forumWriteLimiter,
  validateBody(createThreadSchema),
  forumController.createThread,
);
router.post(
  '/threads/:threadId/posts',
  authenticateToken,
  forumWriteLimiter,
  validateBody(createPostSchema),
  forumController.createPost,
);
router.delete('/threads/:threadId', authenticateToken, forumController.deleteThread);

router.post(
  '/posts/:postId/reactions',
  authenticateToken,
  forumWriteLimiter,
  validateBody(toggleReactionSchema),
  forumController.toggleReaction,
);
router.post('/posts/:postId/solution', authenticateToken, forumController.markSolution);
router.put(
  '/posts/:postId',
  authenticateToken,
  forumWriteLimiter,
  validateBody(updatePostSchema),
  forumController.updatePost,
);
router.delete('/posts/:postId', authenticateToken, forumController.deletePost);

router.put(
  '/users/:userId/role',
  authenticateToken,
  validateBody(updateUserRoleSchema),
  forumController.updateUserRole,
);

export default router;
