import { Router, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import { optionalAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { runCodeSchema, submitCodeSchema } from "../schemas/code.schema.js";
import * as codeController from "../controllers/code.controller.js";

const codeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler(_req: Request, res: Response) {
    const reset = res.getHeader("RateLimit-Reset");
    const seconds = typeof reset === "number" ? reset : parseInt(String(reset), 10) || 60;
    res.status(429).json({
      error: `Too many requests. Try again in ${seconds} seconds.`,
    });
  },
});

const router = Router();

router.post("/", codeLimiter, validateBody(runCodeSchema), codeController.executeCode);
router.post("/submit", codeLimiter, optionalAuth, validateBody(submitCodeSchema), codeController.submitCode);

export default router;
