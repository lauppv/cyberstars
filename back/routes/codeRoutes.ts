import { Router } from "express";
import { optionalAuth } from "../middleware/authToken.js";
import * as codeController from "../controllers/codeController.js";

const router = Router();

router.post("/", codeController.executeCode);
router.post("/submit", optionalAuth, codeController.submitCode);

export default router;
