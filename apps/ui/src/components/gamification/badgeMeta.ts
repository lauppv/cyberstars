import type { TFunction } from 'i18next';

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
