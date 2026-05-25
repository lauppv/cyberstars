import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCurriculum } from "../context/CurriculumContext";
import { useAllProgress } from "../context/ProgressContext";

interface BadgeDef {
  icon: string;
  label: string;
  description: string;
  courseKey: string;
  level: number;
  maxLevel: number;
  earned: boolean;
}

export interface Gamification {
  totalCompleted: number;
  totalLessons: number;
  badges: BadgeDef[];
  newBadge: BadgeDef | null;
  dismissNewBadge: () => void;
  perCourse: Record<string, { done: number; total: number }>;
  isLoading: boolean;
  refresh: () => void;
}

const COURSE_BADGE_ICONS: Record<string, string> = {
  python: "🐍",
  java: "☕",
  c: "⚙️",
  linux: "🐧",
  "algo-python": "🧩",
  "algo-java": "🧩",
  "algo-c": "🧩",
};

const LEVEL_LABELS = ["Bronze", "Silver", "Gold"];

export function useGamification(): Gamification {
  const { isLoggedIn, user } = useAuth();
  const { courses, isLoading: curriculumLoading } = useCurriculum();
  const { progressMap, isLoading: progressLoading, refresh } = useAllProgress();
  const [, setTick] = useState(0);
  const forceRefresh = useCallback(() => { refresh(); setTick((t) => t + 1); }, [refresh]);

  const isLoading = curriculumLoading || (isLoggedIn && progressLoading);

  const { totalCompleted, totalLessons, perCourse } = useMemo(() => {
    let comp = 0;
    let tot = 0;
    const pc: Record<string, { done: number; total: number }> = {};

    for (const c of courses) {
      const p = progressMap[c.key];
      const done = p?.completed ?? 0;
      const total = p?.total ?? c.lessons.length;
      comp += done;
      tot += total;
      pc[c.key] = { done, total };
    }

    return { totalCompleted: comp, totalLessons: tot, perCourse: pc };
  }, [courses, progressMap]);

  const badges: BadgeDef[] = useMemo(() => {
    const result: BadgeDef[] = [];

    for (const c of courses) {
      const { done, total } = perCourse[c.key] ?? { done: 0, total: 0 };
      const maxLevel = Math.max(1, Math.floor(total / 10));
      const icon = COURSE_BADGE_ICONS[c.key] ?? "⭐";

      result.push({
        icon,
        label: `${c.title} First Steps`,
        description: `Complete your first ${c.title} lesson`,
        courseKey: c.key,
        level: 0,
        maxLevel,
        earned: done >= 1,
      });

      for (let lvl = 1; lvl <= maxLevel; lvl++) {
        const threshold = lvl * 10;
        result.push({
          icon,
          label: `${c.title} ${LEVEL_LABELS[lvl - 1] ?? `Lv${lvl}`}`,
          description: `Complete ${threshold} ${c.title} lessons`,
          courseKey: c.key,
          level: lvl,
          maxLevel,
          earned: done >= threshold,
        });
      }
    }

    return result;
  }, [courses, perCourse]);

  const [newBadge, setNewBadge] = useState<BadgeDef | null>(null);
  const prevEarnedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const earnedKeys = new Set(
      badges.filter((b) => b.earned).map((b) => `${b.courseKey}-${b.level}`)
    );
    const prev = prevEarnedRef.current;
    if (prev.size > 0) {
      for (const key of earnedKeys) {
        if (!prev.has(key)) {
          const badge = badges.find((b) => `${b.courseKey}-${b.level}` === key);
          if (badge) setNewBadge(badge);
          break;
        }
      }
    }
    prevEarnedRef.current = earnedKeys;
  }, [badges]);

  const dismissNewBadge = useCallback(() => setNewBadge(null), []);

  return {
    totalCompleted,
    totalLessons,
    badges,
    newBadge,
    dismissNewBadge,
    perCourse,
    isLoading,
    refresh: forceRefresh,
  };
}
