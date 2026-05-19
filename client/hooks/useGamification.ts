import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCurriculum } from "../context/CurriculumContext";
import { useAllProgress } from "../context/ProgressContext";
import { computeLevel, xpForLevel, xpToNextLevel } from "../../shared/constants";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function streakKey(userId: number): string {
  return `cyberstars_activity_days_${userId}`;
}

function migrateOldStreak(userId: number) {
  const oldKey = "cyberstars_activity_days";
  const newKey = streakKey(userId);
  if (localStorage.getItem(newKey)) return;
  const old = localStorage.getItem(oldKey);
  if (old) {
    localStorage.setItem(newKey, old);
    localStorage.removeItem(oldKey);
  }
}

function computeStreak(userId: number | undefined): number {
  if (!userId) return 0;
  try {
    const raw = localStorage.getItem(streakKey(userId));
    if (!raw) return 0;
    const days: string[] = JSON.parse(raw);
    if (!days.length) return 0;

    const today = todayKey();
    let streak = 0;
    if (!days.includes(today)) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (!days.includes(yesterday.toISOString().slice(0, 10))) return 0;
    }

    const check = new Date(today);
    while (true) {
      const key = check.toISOString().slice(0, 10);
      if (days.includes(key)) {
        streak++;
        check.setDate(check.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  } catch {
    return 0;
  }
}

export function recordActivityToday(userId: number) {
  try {
    const key = streakKey(userId);
    const raw = localStorage.getItem(key);
    const days: string[] = raw ? JSON.parse(raw) : [];
    const today = todayKey();
    if (!days.includes(today)) {
      days.push(today);
      if (days.length > 60) days.splice(0, days.length - 60);
      localStorage.setItem(key, JSON.stringify(days));
    }
  } catch { /* localStorage may be unavailable */ }
}

export interface BadgeDef {
  icon: string;
  label: string;
  earned: boolean;
}

export interface Gamification {
  totalCompleted: number;
  totalLessons: number;
  xp: number;
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  streak: number;
  badges: BadgeDef[];
  perCourse: Record<string, { done: number; total: number }>;
  isLoading: boolean;
  refresh: () => void;
}

export function useGamification(): Gamification {
  const { isLoggedIn, user } = useAuth();
  const { courses, isLoading: curriculumLoading } = useCurriculum();
  const { progressMap, isLoading: progressLoading, refresh } = useAllProgress();
  const [, setTick] = useState(0);
  const forceRefresh = useCallback(() => { refresh(); setTick((t) => t + 1); }, [refresh]);

  const isLoading = curriculumLoading || (isLoggedIn && progressLoading);

  const { totalCompleted, totalLessons, xp, perCourse } = useMemo(() => {
    let comp = 0;
    let tot = 0;
    let totalXp = 0;
    const pc: Record<string, { done: number; total: number }> = {};

    for (const c of courses) {
      const p = progressMap[c.key];
      const done = p?.completed ?? 0;
      const total = p?.total ?? c.lessons.length;
      comp += done;
      tot += total;
      totalXp += p?.earnedXp ?? 0;
      pc[c.key] = { done, total };
    }

    return { totalCompleted: comp, totalLessons: tot, xp: totalXp, perCourse: pc };
  }, [courses, progressMap]);

  const level = computeLevel(xp);
  const xpInLevel = xp - xpForLevel(level);
  const xpNext = xpToNextLevel(level);

  const badges: BadgeDef[] = useMemo(() => {
    const aCourseFullyComplete = Object.entries(perCourse).some(
      ([, v]) => v.total > 0 && v.done === v.total
    );
    const multipleCoursesDone = Object.entries(perCourse).filter(
      ([, v]) => v.total > 0 && v.done === v.total
    ).length;

    return [
      { icon: "🐍", label: "First Code", earned: totalCompleted >= 1 },
      { icon: "⚡", label: "Speed Run", earned: totalCompleted >= 5 },
      { icon: "🧠", label: "Bug Squasher", earned: totalCompleted >= 10 },
      { icon: "🔥", label: "On Fire", earned: totalCompleted >= 20 },
      { icon: "💎", label: "Diamond", earned: totalCompleted >= 30 },
      { icon: "🏅", label: "Half Century", earned: totalCompleted >= 50 },
      { icon: "🌟", label: "Course Master", earned: aCourseFullyComplete },
      { icon: "👑", label: "Polyglot", earned: multipleCoursesDone >= 2 },
    ];
  }, [totalCompleted, perCourse]);

  if (user) migrateOldStreak(user.id);
  const streak = computeStreak(user?.id);

  return {
    totalCompleted,
    totalLessons,
    xp,
    level,
    xpInLevel,
    xpForNextLevel: xpNext,
    streak,
    badges,
    perCourse,
    isLoading,
    refresh: forceRefresh,
  };
}
