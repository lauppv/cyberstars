import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
import { solutionSchema } from '../schemas/usage.schema.js';
import { getUsage, revealSolution } from '../controllers/usage.controller.js';

const router = Router();

router.get('/', authenticateToken, getUsage);
router.post(
  '/solution/:courseKey/:lessonSlug',
  authenticateToken,
  validateBody(solutionSchema),
  revealSolution,
);

export default router;
