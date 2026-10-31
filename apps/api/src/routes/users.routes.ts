import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireFeatureAccess } from '../middleware/features.js';
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
