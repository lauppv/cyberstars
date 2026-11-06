import type { TFunction } from 'i18next';

// Frame metal per badge level: 0 First Steps, then Bronze, Silver, Gold, Platinum, Diamond, Legend
export const TIERS = [
  { dark: '#4a3db8', mid: '#6c5ce7', light: '#b7aefc' },
  { dark: '#6e4322', mid: '#c27c45', light: '#f2c194' },
  { dark: '#6b717c', mid: '#c3c8d0', light: '#ffffff' },
  { dark: '#8f6410', mid: '#e8b23a', light: '#fff0b3' },
  { dark: '#4f7d8c', mid: '#9fd0dc', light: '#effcff' },
  { dark: '#1d6fa8', mid: '#45b8ee', light: '#c9f2ff' },
  { dark: '#8a1f5c', mid: '#e0468f', light: '#ffc2e0' },
];

// Tier names for levels 1..6, one per frame in BadgeEmblem; beyond that the level, as the page's language shortens it.
const TIER_KEYS = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'legend'];

// level 0 = "First Steps" (>=1 lesson), level N = the Nth 10-lesson tier.
export function badgeLabel(t: TFunction, courseTitle: string, level: number): string {
  if (level === 0) return t('gamification.firstSteps', { course: courseTitle });
  const tierKey = TIER_KEYS[level - 1];
  const tier = tierKey ? t(`gamification.${tierKey}`) : t('level.short', { n: level });
  return t('gamification.tier', { course: courseTitle, tier });
}

export function badgeDescription(t: TFunction, courseTitle: string, level: number): string {
  if (level === 0) return t('gamification.firstStepsDesc', { course: courseTitle });
  return t('gamification.tierDesc', { course: courseTitle, count: level * 10 });
}

// A course has First Steps, then one badge per full 10 lessons (at least one)
export function badgeMaxLevel(total: number): number {
  return Math.max(1, Math.floor(total / 10));
}
