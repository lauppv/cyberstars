import { Router } from "express";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";
import * as ctrl from "../controllers/terminal.controller.js";

const router = Router();

router.post("/session", authenticateToken, ctrl.createSession);
router.post("/exec", authenticateToken, ctrl.exec);
router.post("/submit", optionalAuth, ctrl.submit);
router.delete("/session/:sessionId", authenticateToken, ctrl.destroy);

export default router;
