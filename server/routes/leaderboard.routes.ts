import { Router } from 'express';
import { authenticateToken, optionalAuth, requireFeatureAccess } from '../middleware/auth.js';
import * as leaderboardController from '../controllers/leaderboard.controller.js';

const router = Router();
const gate = requireFeatureAccess('leaderboard');

// The list is public read-only (§7.6): guests see it as an invite to sign up.
// optionalAuth sets req.user when a token is present so the preview gate can
// read the role, but no token is required on dev.
router.get('/', optionalAuth, gate, leaderboardController.getLeaderboard);
// "My rank" needs an identity, so it requires auth.
router.get('/me', authenticateToken, gate, leaderboardController.getMyRank);

export default router;
