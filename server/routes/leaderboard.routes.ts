import { Router } from "express";
import { optionalAuth } from "../middleware/auth.js";
import * as progressController from "../controllers/progress.controller.js";

const router = Router();

router.get("/", optionalAuth, progressController.getLeaderboard);

export default router;
