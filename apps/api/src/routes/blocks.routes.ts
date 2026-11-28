import { Router } from 'express';
import type { Request } from 'express';
import { limiter } from '../middleware/rateLimit.js';
import { authenticateToken } from '../middleware/auth.js';
import * as blocksController from '../controllers/blocks.controller.js';

// Keyed per user, not per IP: a class shares one school IP. authenticateToken
// runs first, so req.user is always set here.
const perUser = (req: Request) => String(req.user!.id);

// Block and unblock are cheap toggles; the cap only stops a script.
const toggleLimiter = limiter({
  windowMs: 60_000,
  limit: 30,
  keyGenerator: perUser,
});

const router = Router();

// Students only (no guests). No feature gate: a block covers both direct
// messages and connection requests.
router.use(authenticateToken);

router.get('/', blocksController.list);
router.put('/:userId', toggleLimiter, blocksController.block);
router.delete('/:userId', toggleLimiter, blocksController.unblock);

export default router;
