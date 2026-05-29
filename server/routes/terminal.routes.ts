import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createSessionSchema, execSchema } from '../schemas/terminal.schema.js';
import * as ctrl from '../controllers/terminal.controller.js';

// Each exec is a real docker exec fork; cap per authenticated user.
const terminalExecLimiter = rateLimit({
  windowMs: 60_000,
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => String(req.user!.id),
});

const router = Router();

router.post('/session', authenticateToken, validateBody(createSessionSchema), ctrl.createSession);
router.post(
  '/exec',
  authenticateToken,
  terminalExecLimiter,
  validateBody(execSchema),
  ctrl.exec,
);
router.delete('/session/:sessionId', authenticateToken, ctrl.destroy);

export default router;
