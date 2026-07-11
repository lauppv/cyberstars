import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { useAllProgress } from '../context/ProgressContext';
import { levelFromXp, xpForLevel, levelTitleKey, xpForCourse } from '../../shared/constants';

interface BadgeDef {
  icon: string;
  label: string;
  description: string;
  courseKey: string;
  level: number;
  maxLevel: number;
  earned: boolean;
}

interface XpState {
  earnedXp: number;
  totalXp: number;
  level: number;
  titleKey: string;
  xpIntoLevel: number; // XP accumulated within the current level
  xpForLevelSpan: number; // XP needed to advance from this level to the next
  xpPct: number; // 0-100 progress through the current level
}

export interface Gamification {
  totalCompleted: number;
  totalLessons: number;
  xp: XpState;
  badges: BadgeDef[];
  newBadge: BadgeDef | null;
  dismissNewBadge: () => void;
  perCourse: Record<string, { done: number; total: number }>;
  isLoading: boolean;
  refresh: () => void;
}

const COURSE_BADGE_ICONS: Record<string, string> = {
  python: '🐍',
  java: '☕',
  c: '⚙️',
  linux: '🐧',
  'algo-python': '🧩',
  'algo-java': '🧩',
  'algo-c': '🧩',
};

const TIER_KEYS = ['bronze', 'silver', 'gold'];

export function useGamification(): Gamification {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const { courses, isLoading: curriculumLoading } = useCurriculum();
  const { progressMap, isLoading: progressLoading, refresh } = useAllProgress();
  const [, setTick] = useState(0);
  const forceRefresh = useCallback(() => {
    refresh();
    setTick((t) => t + 1);
  }, [refresh]);

  const isLoading = curriculumLoading || (isLoggedIn && progressLoading);

  const { totalCompleted, totalLessons, perCourse, xp } = useMemo(() => {
    let comp = 0;
    let tot = 0;
    let earnedXp = 0;
    let totalXp = 0;
    const pc: Record<string, { done: number; total: number }> = {};

    for (const c of courses) {
      const p = progressMap[c.key];
      const done = p?.completed ?? 0;
      const total = p?.total ?? c.lessons.length;
      comp += done;
      tot += total;
      earnedXp += p?.earnedXp ?? 0;
      totalXp += p?.totalXp ?? xpForCourse(c.lessons.length);
      pc[c.key] = { done, total };
    }

    const level = levelFromXp(earnedXp);
    const levelStart = xpForLevel(level);
    const xpIntoLevel = earnedXp - levelStart;
    const xpForLevelSpan = xpForLevel(level + 1) - levelStart;
    const xpState: XpState = {
      earnedXp,
      totalXp,
      level,
      titleKey: levelTitleKey(level),
      xpIntoLevel,
      xpForLevelSpan,
      xpPct: xpForLevelSpan > 0 ? Math.round((xpIntoLevel / xpForLevelSpan) * 100) : 0,
    };

    return { totalCompleted: comp, totalLessons: tot, perCourse: pc, xp: xpState };
  }, [courses, progressMap]);

  const badges: BadgeDef[] = useMemo(() => {
    const result: BadgeDef[] = [];

    for (const c of courses) {
      const { done, total } = perCourse[c.key] ?? { done: 0, total: 0 };
      const maxLevel = Math.max(1, Math.floor(total / 10));
      const icon = COURSE_BADGE_ICONS[c.key] ?? '⭐';

      result.push({
        icon,
        label: t('gamification.firstSteps', { course: c.title }),
        description: t('gamification.firstStepsDesc', { course: c.title }),
        courseKey: c.key,
        level: 0,
        maxLevel,
        earned: done >= 1,
      });

      for (let lvl = 1; lvl <= maxLevel; lvl++) {
        const threshold = lvl * 10;
        const tierKey = TIER_KEYS[lvl - 1];
        const tier = tierKey ? t(`gamification.${tierKey}`) : `Lv${lvl}`;
        result.push({
          icon,
          label: t('gamification.tier', { course: c.title, tier }),
          description: t('gamification.tierDesc', { course: c.title, count: threshold }),
          courseKey: c.key,
          level: lvl,
          maxLevel,
          earned: done >= threshold,
        });
      }
    }

    return result;
  }, [courses, perCourse, t]);

  const [newBadge, setNewBadge] = useState<BadgeDef | null>(null);
  const prevEarnedRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    const earnedKeys = new Set(
      badges.filter((b) => b.earned).map((b) => `${b.courseKey}-${b.level}`),
    );
    if (!initializedRef.current) {
      prevEarnedRef.current = earnedKeys;
      initializedRef.current = true;
      return;
    }
    const prev = prevEarnedRef.current;
    for (const key of earnedKeys) {
      if (!prev.has(key)) {
        const badge = badges.find((b) => `${b.courseKey}-${b.level}` === key);
        if (badge) setTimeout(() => setNewBadge(badge), 0);
        break;
      }
    }
    prevEarnedRef.current = earnedKeys;
  }, [badges, isLoading]);

  const dismissNewBadge = useCallback(() => setNewBadge(null), []);

  return {
    totalCompleted,
    totalLessons,
    xp,
    badges,
    newBadge,
    dismissNewBadge,
    perCourse,
    isLoading,
    refresh: forceRefresh,
  };
}
