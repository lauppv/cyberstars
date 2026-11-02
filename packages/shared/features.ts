import { featureRule, type PreviewFlags } from '@cyberstars-framework/access/rules';
import { isAdmin, type UserRole } from './auth.js';

export type FeatureKey =
  | 'leaderboard'
  | 'messaging'
  | 'notifications'
  | 'connections'
  | 'tutorChat';

// Features that are "preview": live in the code, but on production only ADMINs
// can reach them; everyone else sees a "Coming Soon" treatment and the routes
// answer 404. On dev (isProd === false) they are open to everyone so the whole
// team can build and test them. To launch a feature publicly, flip its value to
// `false`, a single edit, no refactor.
export const PREVIEW_FEATURES: PreviewFlags<FeatureKey> = {
  leaderboard: false,
  messaging: false,
  notifications: false,
  connections: false,
  tutorChat: false,
};

// Shared access rule (the access package's, over CyberStars' features and its
// admins and founder), used identically by the server (isProd = NODE_ENV ===
// 'production') and the client (isProd = import.meta.env.PROD) so UI gating and
// API gating can never disagree.
export const canAccessFeature = featureRule<FeatureKey, UserRole>({
  preview: PREVIEW_FEATURES,
  isAdmin,
});
