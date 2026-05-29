import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { validateBody } from '../middleware/validate.js';
import { runCodeSchema } from '../schemas/code.schema.js';
import * as codeController from '../controllers/code.controller.js';

const codeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 10_000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler(_req: Request, res: Response) {
    const reset = res.getHeader('RateLimit-Reset');
    const seconds = typeof reset === 'number' ? reset : parseInt(String(reset), 10) || 60;
    res.status(429).json({
      error: `Too many requests. Try again in ${seconds} seconds.`,
    });
  },
});

const router = Router();

router.post('/', codeLimiter, validateBody(runCodeSchema), codeController.executeCode);

export default router;
