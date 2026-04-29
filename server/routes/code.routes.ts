import { Router } from "express";
import { optionalAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { runCodeSchema, submitCodeSchema } from "../schemas/code.schema.js";
import * as codeController from "../controllers/code.controller.js";

const router = Router();

router.post("/", validateBody(runCodeSchema), codeController.executeCode);
router.post("/submit", optionalAuth, validateBody(submitCodeSchema), codeController.submitCode);

export default router;
