import { Router, type Request } from 'express';
import { limiter } from '../middleware/rateLimit.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireFeatureAccess } from '../middleware/features.js';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
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
const tutorLimiter = limiter({
  windowMs: 60_000,
  limit: 10,
  keyGenerator: (req: Request) => String(req.user!.id),
  handler: execRateLimitHandler,
});

// Reading and deleting a conversation call no model, so they get the looser
// cap the other history lists use.
const conversationLimiter = limiter({
  windowMs: 60_000,
  limit: 60,
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
