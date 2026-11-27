import { PREVIEW_FEATURES, type FeatureKey } from '@cyberstars/shared/features';

// What the app marks New for a while after it launches: Web Development (its
// card on Courses and the sidebar's Courses row) and Projects (its row).
// Taking a key out takes its marks away; nothing is new right now
const MARKED_NEW: readonly FeatureKey[] = [];

// New only once launched: while in preview it says Coming soon instead
export function isMarkedNew(feature: FeatureKey): boolean {
  return MARKED_NEW.includes(feature) && !PREVIEW_FEATURES[feature];
}

// The yellow every New mark shares: a card's pill, a sidebar row's tag
export const NEW_TONE = 'bg-[#facc15] text-[#1a1a1a]';
