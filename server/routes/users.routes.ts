import { Router } from 'express';
import { authenticateToken, requireFeatureAccess } from '../middleware/auth.js';
import * as usersController from '../controllers/users.controller.js';

const router = Router();

// Profiles are reached from the leaderboard and ride the same feature gate.
// Logged-in users only (no guests): authenticateToken guarantees req.user, so
// the service can always tell "self" from "other".
router.get(
  '/:id/profile',
  authenticateToken,
  requireFeatureAccess('leaderboard'),
  usersController.getPublicProfile,
);

export default router;
