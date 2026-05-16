import { Router } from "express";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import {
  createThreadSchema,
  createPostSchema,
  updatePostSchema,
  toggleReactionSchema,
  updateUserRoleSchema,
} from "../schemas/forum.schema.js";
import * as forumController from "../controllers/forum.controller.js";

const router = Router();

router.get("/categories", forumController.getCategories);
router.get("/categories/:categorySlug/threads", forumController.getThreads);
router.get("/threads/:threadId", optionalAuth, forumController.getThread);

router.post("/threads", authenticateToken, validateBody(createThreadSchema), forumController.createThread);
router.post("/threads/:threadId/posts", authenticateToken, validateBody(createPostSchema), forumController.createPost);
router.delete("/threads/:threadId", authenticateToken, forumController.deleteThread);

router.post("/posts/:postId/reactions", authenticateToken, validateBody(toggleReactionSchema), forumController.toggleReaction);
router.post("/posts/:postId/solution", authenticateToken, forumController.markSolution);
router.put("/posts/:postId", authenticateToken, validateBody(updatePostSchema), forumController.updatePost);
router.delete("/posts/:postId", authenticateToken, forumController.deletePost);

router.put("/users/:userId/role", authenticateToken, validateBody(updateUserRoleSchema), forumController.updateUserRole);

export default router;
