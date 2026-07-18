import type { TFunction } from 'i18next';

// Per-course badge icon. Falls back to a generic star for unknown courses.
const COURSE_BADGE_ICONS: Record<string, string> = {
  python: '🐍',
  java: '☕',
  c: '⚙️',
  linux: '🐧',
  'algo-python': '🧩',
  'algo-java': '🧩',
  'algo-c': '🧩',
};

// Tier names for levels 1..3; beyond that we fall back to "Lv{n}".
const TIER_KEYS = ['bronze', 'silver', 'gold'];

export function badgeIcon(courseKey: string): string {
  return COURSE_BADGE_ICONS[courseKey] ?? '⭐';
}

// level 0 = "First Steps" (>=1 lesson), level N = the Nth 10-lesson tier.
export function badgeLabel(t: TFunction, courseTitle: string, level: number): string {
  if (level === 0) return t('gamification.firstSteps', { course: courseTitle });
  const tierKey = TIER_KEYS[level - 1];
  const tier = tierKey ? t(`gamification.${tierKey}`) : `Lv${level}`;
  return t('gamification.tier', { course: courseTitle, tier });
}

export function badgeDescription(t: TFunction, courseTitle: string, level: number): string {
  if (level === 0) return t('gamification.firstStepsDesc', { course: courseTitle });
  return t('gamification.tierDesc', { course: courseTitle, count: level * 10 });
}
