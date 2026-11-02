import { createFeatureGate } from '@cyberstars-framework/access/server';
import { canAccessFeature, type FeatureKey } from '@cyberstars/shared/features';
import type { UserRole } from '@cyberstars/shared/auth';
import * as userRepo from '../repositories/user.repository.js';
import { config } from '../config/index.js';

// Server-authoritative gate for preview features: the access package's gate
// with CyberStars' rule (see shared/features.ts). May run after either
// authenticateToken (user guaranteed) or optionalAuth (user may be absent, e.g.
// guest on the public leaderboard). On prod, a non-admin gets 404 (not 403) so
// the endpoint's very existence stays hidden. The role is read from the DB,
// and only when the gate needs it: on dev, or for a launched feature, everyone
// passes without a query.
export const requireFeatureAccess = createFeatureGate<FeatureKey, UserRole>({
  canAccess: (feature, role) => canAccessFeature(feature, role, config.isProduction),
  role: async (req) => (req.user ? userRepo.getRole(req.user.id) : undefined),
});
