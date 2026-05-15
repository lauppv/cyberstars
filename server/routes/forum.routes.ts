import { Router } from "express";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";
import * as forumController from "../controllers/forum.controller.js";

const router = Router();

router.get("/categories", forumController.getCategories);
router.get("/categories/:categorySlug/threads", forumController.getThreads);
router.get("/threads/:threadId", optionalAuth, forumController.getThread);

router.post("/threads", authenticateToken, forumController.createThread);
router.post("/threads/:threadId/posts", authenticateToken, forumController.createPost);

router.post("/posts/:postId/reactions", authenticateToken, forumController.toggleReaction);
router.post("/posts/:postId/solution", authenticateToken, forumController.markSolution);

export default router;
