// Who may use what: the feature rule and the usage limits, which an app's UI
// reads to show what it offers and its server reads to enforce it, so the two
// can never disagree. Nothing here runs only on a server.

// The app's features, each in preview (true) or launched (false). A preview
// feature is live in the code, but in production only admins reach it; in
// development everyone does, so the whole team can build and test it. A launch
// is a one-line edit: flip the feature to false.
export type PreviewFlags<Feature extends string> = Record<Feature, boolean>;

export interface FeatureOptions<Feature extends string, Role extends string> {
  preview: PreviewFlags<Feature>;
  // Which roles reach a preview feature in production; undefined for a guest
  isAdmin: (role: Role | undefined) => boolean;
}

// The app's feature rule. The flags are read on every call, so a test can put
// a feature in preview for a while
export function featureRule<Feature extends string, Role extends string>(
  options: FeatureOptions<Feature, Role>,
) {
  const { preview, isAdmin } = options;
  return function canAccessFeature(
    feature: Feature,
    role: Role | undefined,
    isProd: boolean,
  ): boolean {
    if (!preview[feature]) return true; // launched
    if (!isProd) return true; // development: open to everyone
    return isAdmin(role); // preview in production: admins only
  };
}

// How much of an action one user may use: `limit` units per window. A window
// opens with the first use after the last one ended and refills all at once
// when it ends, `windowMs` after it opened. Admins are unlimited
export interface UsageRule {
  limit: number;
  windowMs: number;
}

export type UsageRules<Action extends string> = Record<Action, UsageRule>;

// How a 429 for a spent allowance starts, so the UI can tell it apart from a
// per-minute rate limit
export const USAGE_LIMIT_ERROR = 'Limit reached';

export interface UsageState {
  used: number;
  limit: number;
  remaining: number;
  // ISO timestamp when the current window resets, or null when nothing has been
  // used yet in a window (or the caller is unlimited).
  resetAt: string | null;
  unlimited: boolean;
}

export type UsageSummary<Action extends string> = Record<Action, UsageState>;
