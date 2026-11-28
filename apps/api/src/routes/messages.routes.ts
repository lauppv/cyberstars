import { Router } from 'express';
import type { Request } from 'express';
import { limiter } from '../middleware/rateLimit.js';
import { newTicketLimiter } from '../middleware/ticketLimit.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireFeatureAccess } from '../middleware/features.js';
import { validateBody } from '@cyberstars-framework/server-kit/validate';
import {
  sendMessageSchema,
  startConversationSchema,
  markReadSchema,
  toggleReactionSchema,
  reportMessageSchema,
} from '../schemas/messages.schema.js';
import * as messagesController from '../controllers/messages.controller.js';

// Keyed per user, not per IP: the audience is students in schools behind shared
// NAT, where an IP window would be split across everyone in the room.
// authenticateToken runs before the limiters, so req.user is always set here.
const perUser = (req: Request) => String(req.user!.id);

// Cap message sends per user, first messages included; abuse is otherwise held
// in check by this + blocking (CYB-140). Reads are cheap and unlimited.
const sendLimiter = limiter({
  windowMs: 60_000,
  limit: 20,
  keyGenerator: perUser,
});

// Reactions are toggles on existing rows (cheap, bounded by the unique index),
// so the cap is looser than sends but still shields the DB from click-spam.
const reactLimiter = limiter({
  windowMs: 60_000,
  limit: 60,
  keyGenerator: perUser,
});

const router = Router();

// Messaging requires an identity (no guests) and passes the preview gate: on
// prod a non-admin gets 404, so the feature stays hidden until launch.
router.use(authenticateToken, requireFeatureAccess('messaging'));

router.get('/conversations', messagesController.getInbox);
router.post(
  '/conversations',
  sendLimiter,
  validateBody(startConversationSchema),
  messagesController.startConversation,
);
router.get('/conversations/:id', messagesController.getHistory);
router.post(
  '/conversations/:id',
  sendLimiter,
  validateBody(sendMessageSchema),
  messagesController.sendMessage,
);
router.post('/conversations/:id/read', validateBody(markReadSchema), messagesController.markRead);
router.patch(
  '/:messageId',
  sendLimiter,
  validateBody(sendMessageSchema),
  messagesController.editMessage,
);
router.delete('/:messageId', messagesController.deleteMessage);
router.post(
  '/:messageId/reactions',
  reactLimiter,
  validateBody(toggleReactionSchema),
  messagesController.toggleReaction,
);

router.post(
  '/:messageId/report',
  // A report is a support ticket, so it shares the support form's bucket
  newTicketLimiter,
  validateBody(reportMessageSchema),
  messagesController.reportMessage,
);

export default router;
