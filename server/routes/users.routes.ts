import { Router } from 'express';
import { optionalAuth, requireFeatureAccess } from '../middleware/auth.js';
import * as usersController from '../controllers/users.controller.js';

const router = Router();

// Public profiles are reached from the leaderboard, so they ride the same
// preview gate: on prod only ADMINs can view them, everyone on dev.
// optionalAuth sets req.user (when a token is present) so the gate can read the
// role and the service can tell "self" from "other".
router.get(
  '/:id/profile',
  optionalAuth,
  requireFeatureAccess('leaderboard'),
  usersController.getPublicProfile,
);

export default router;
