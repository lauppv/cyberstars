import { Router, type Request } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireFeatureAccess } from '../middleware/features.js';
import { limiter } from '../middleware/rateLimit.js';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
import { projectCheckSchema } from '../schemas/projects.schema.js';
import * as projectsController from '../controllers/projects.controller.js';

// A plain DB read or write per tick, so a loose cap per student;
// authenticateToken runs first, so req.user is always set here.
const projectsLimiter = limiter({
  windowMs: 60_000,
  limit: 120,
  keyGenerator: (req: Request) => String(req.user!.id),
});

const router = Router();

// Ticks belong to an account: a guest reads the projects but keeps no ticks
router.use(authenticateToken, requireFeatureAccess('projects'), projectsLimiter);
router.get('/checks', projectsController.listChecks);
router.put(
  '/:language/:slug/steps/:stepId',
  validateBody(projectCheckSchema),
  projectsController.setCheck,
);

export default router;
