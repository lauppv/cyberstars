import { Router, type Request } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken, requireFeatureAccess } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { tutorChatSchema } from '../schemas/tutor.schema.js';
import { execRateLimitHandler } from './terminal.routes.js';
import {
  chat,
  deleteConversation,
  getConversation,
  listConversations,
} from '../controllers/tutor.controller.js';

// A message can cost up to four Gemini calls (three tool rounds and the answer)
// against a shared quota, so cap it per user.
const tutorLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => String(req.user!.id),
  handler: execRateLimitHandler,
});

// Reading and deleting a conversation call no model, so they get the looser
// cap the other history lists use.
const conversationLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => String(req.user!.id),
});

const router = Router();

router.post(
  '/chat',
  authenticateToken,
  requireFeatureAccess('tutorChat'),
  tutorLimiter,
  validateBody(tutorChatSchema),
  chat,
);

// The student's conversations, newest first, then one of them.
const gate = [authenticateToken, requireFeatureAccess('tutorChat'), conversationLimiter];
router.get('/conversations', ...gate, listConversations);
router.get('/conversations/:id', ...gate, getConversation);
router.delete('/conversations/:id', ...gate, deleteConversation);

export default router;
