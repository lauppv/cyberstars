import { Router } from 'express';
import { authenticateToken, requireFeatureAccess } from '../middleware/auth.js';
import * as leaderboardController from '../controllers/leaderboard.controller.js';

const router = Router();
const gate = requireFeatureAccess('leaderboard');

// Logged-in users only: the page exposes `total` (the platform-wide account
// count), so guests are kept out even though the feature is launched.
router.get('/', authenticateToken, gate, leaderboardController.getLeaderboard);
// "My rank" needs an identity, so it requires auth.
router.get('/me', authenticateToken, gate, leaderboardController.getMyRank);

export default router;
