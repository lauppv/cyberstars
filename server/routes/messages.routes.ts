import { Router } from 'express';
import type { Request } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken, requireFeatureAccess } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  openConversationSchema,
  sendMessageSchema,
  markReadSchema,
} from '../schemas/messages.schema.js';
import * as messagesController from '../controllers/messages.controller.js';

// Keyed per user, not per IP: the audience is students in schools behind shared
// NAT, where an IP window would be split across everyone in the room.
// authenticateToken runs before the limiters, so req.user is always set here.
const perUser = (req: Request) => String(req.user!.id);

// Cap message sends per user; abuse is otherwise held in check by this + (later)
// the block feature. Reads are cheap and unlimited.
const sendLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 20,
  keyGenerator: perUser,
});

// Opening a conversation creates a row, so cap it too — otherwise a caller could
// spam new conversations against every user id. Higher than sends since it's an
// idempotent find-or-create.
const openLimiter = rateLimit({
  windowMs: 60_000,
  /* v8 ignore next -- NODE_ENV ternary evaluated at module load; only the 'test' branch runs in tests. */
  limit: process.env.NODE_ENV === 'test' ? 10_000 : 30,
  keyGenerator: perUser,
});

const router = Router();

// Messaging requires an identity (no guests) and passes the preview gate: on
// prod a non-admin gets 404, so the feature stays hidden until launch.
router.use(authenticateToken, requireFeatureAccess('messaging'));

router.get('/conversations', messagesController.getInbox);
router.post(
  '/conversations',
  openLimiter,
  validateBody(openConversationSchema),
  messagesController.openConversation,
);
router.get('/conversations/:id', messagesController.getHistory);
router.post(
  '/conversations/:id',
  sendLimiter,
  validateBody(sendMessageSchema),
  messagesController.sendMessage,
);
router.post('/conversations/:id/read', validateBody(markReadSchema), messagesController.markRead);
router.delete('/:messageId', messagesController.deleteMessage);

export default router;
