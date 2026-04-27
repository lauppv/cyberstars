import { Router } from "express";
import * as lessonController from "../controllers/lessonController.js";

const router = Router();

router.get("/lessons/:lang/:lesson", lessonController.getLesson);
router.get("/lesson-code/:lang/:file", lessonController.getLessonCode);
router.get("/curriculum", lessonController.getCurriculum);

export default router;
