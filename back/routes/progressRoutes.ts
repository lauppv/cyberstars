import { Router } from "express";
import { authenticateToken } from "../middleware/authToken.js";
import * as progressController from "../controllers/progressController.js";

const router = Router();

router.use(authenticateToken);

router.get("/:courseKey", progressController.getCourseProgress);
router.post("/:courseKey/:lessonSlug/complete", progressController.markComplete);
router.get("/:courseKey/:lessonSlug/code", progressController.getSavedCode);
router.put("/:courseKey/:lessonSlug/code", progressController.saveCode);
router.post("/:courseKey/:lessonSlug/access", progressController.trackAccess);

export default router;
