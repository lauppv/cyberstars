import { isAdmin, type UserRole } from './auth.js';

export type FeatureKey =
  | 'leaderboard'
  | 'messaging'
  | 'notifications'
  | 'connections'
  | 'radio'
  | 'aiHints';

// Features that are "preview": live in the code, but on production only ADMINs
// can reach them — everyone else sees a "Coming Soon" treatment and the routes
// answer 404. On dev (isProd === false) they are open to everyone so the whole
// team can build and test them. To launch a feature publicly, flip its value to
// `false` (or drop the key) — a single edit, no refactor.
export const PREVIEW_FEATURES: Record<FeatureKey, boolean> = {
  leaderboard: false,
  messaging: false,
  notifications: true,
  connections: true,
  radio: false,
  aiHints: true,
};

// Shared access rule, used identically by the server (isProd = NODE_ENV ===
// 'production') and the client (isProd = import.meta.env.PROD) so UI gating and
// API gating can never disagree.
export function canAccessFeature(
  key: FeatureKey,
  role: UserRole | undefined,
  isProd: boolean,
): boolean {
  if (!PREVIEW_FEATURES[key]) return true; // fully launched
  if (!isProd) return true; // dev: open to everyone
  return isAdmin(role); // prod preview: admins (and founder) only
}
