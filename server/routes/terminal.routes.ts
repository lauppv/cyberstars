import { Router } from "express";
import { optionalAuth } from "../middleware/auth.js";
import * as ctrl from "../controllers/terminal.controller.js";

const router = Router();

router.post("/session", ctrl.createSession);
router.post("/exec", ctrl.exec);
router.post("/submit", optionalAuth, ctrl.submit);
router.delete("/session/:sessionId", ctrl.destroy);

export default router;
