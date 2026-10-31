import type { Request, Response, NextFunction } from 'express';
import { canAccessFeature, type FeatureKey } from '@cyberstars/shared/features';
import * as userRepo from '../repositories/user.repository.js';
import { config } from '../config/index.js';

// Server-authoritative gate for preview features (see shared/features.ts). May
// run after either authenticateToken (user guaranteed) or optionalAuth (user
// may be absent, e.g. guest on the public leaderboard). On prod, a non-admin
// gets 404 (not 403) so the endpoint's very existence stays hidden.
export function requireFeatureAccess(key: FeatureKey) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isProd = config.isProduction;
      // Only the prod gate needs the DB-authoritative role; on dev everyone
      // passes, so skip the query entirely.
      const role = isProd && req.user ? await userRepo.getRole(req.user.id) : undefined;
      if (!canAccessFeature(key, role, isProd)) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
