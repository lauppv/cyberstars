import { useCallback, useEffect, useState } from "react";
import { fetchCurriculum } from "../services/lessonService";
import * as progressService from "../services/progressService";
import { useAuth } from "../context/AuthContext";

const XP_PER_LESSON = 15;
const XP_PER_LEVEL = 300;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function computeStreak(): number {
  try {
    const raw = localStorage.getItem("cyberstars_activity_days");
    if (!raw) return 0;
    const days: string[] = JSON.parse(raw);
    if (!days.length) return 0;

    const today = todayKey();
    let streak = 0;
    const d = new Date(days.includes(today) ? today : today);
    if (!days.includes(today)) {
      const yesterday = new Date(d);
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = yesterday.toISOString().slice(0, 10);
      if (!days.includes(yKey)) return 0;
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

export function recordActivityToday() {
  try {
    const raw = localStorage.getItem("cyberstars_activity_days");
    const days: string[] = raw ? JSON.parse(raw) : [];
    const today = todayKey();
    if (!days.includes(today)) {
      days.push(today);
      if (days.length > 60) days.splice(0, days.length - 60);
      localStorage.setItem("cyberstars_activity_days", JSON.stringify(days));
    }
  } catch {}
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
  const { isLoggedIn } = useAuth();
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [perCourseDone, setPerCourseDone] = useState<Record<string, number>>({});
  const [perCourseTotal, setPerCourseTotal] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const courses = await fetchCurriculum();
        const totals: Record<string, number> = {};
        let tot = 0;
        for (const c of courses) {
          totals[c.key] = c.lessons.length;
          tot += c.lessons.length;
        }

        if (!isLoggedIn) {
          if (!cancelled) {
            setTotal(tot);
            setPerCourseTotal(totals);
            setIsLoading(false);
          }
          return;
        }

        const dones: Record<string, number> = {};
        let comp = 0;
        await Promise.all(
          courses.map(async (c) => {
            try {
              const p = await progressService.getCourseProgress(c.key);
              dones[c.key] = p.completed;
              comp += p.completed;
            } catch {
              dones[c.key] = 0;
            }
          })
        );

        if (!cancelled) {
          setTotal(tot);
          setCompleted(comp);
          setPerCourseTotal(totals);
          setPerCourseDone(dones);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isLoggedIn, refreshKey]);

  const xp = completed * XP_PER_LESSON;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInLevel = xp % XP_PER_LEVEL;
  const xpForNextLevel = XP_PER_LEVEL;

  const aCourseFullyComplete = Object.keys(perCourseTotal).some(
    (k) => perCourseTotal[k] > 0 && perCourseDone[k] === perCourseTotal[k]
  );

  const multipleCoursesDone = Object.keys(perCourseTotal).filter(
    (k) => perCourseTotal[k] > 0 && perCourseDone[k] === perCourseTotal[k]
  ).length;

  const badges: BadgeDef[] = [
    { icon: "🐍", label: "First Code", earned: completed >= 1 },
    { icon: "⚡", label: "Speed Run", earned: completed >= 5 },
    { icon: "🧠", label: "Bug Squasher", earned: completed >= 10 },
    { icon: "🔥", label: "On Fire", earned: completed >= 20 },
    { icon: "💎", label: "Diamond", earned: completed >= 30 },
    { icon: "🏅", label: "Half Century", earned: completed >= 50 },
    { icon: "🌟", label: "Course Master", earned: aCourseFullyComplete },
    { icon: "👑", label: "Polyglot", earned: multipleCoursesDone >= 2 },
  ];

  const perCourse: Record<string, { done: number; total: number }> = {};
  for (const k of Object.keys(perCourseTotal)) {
    perCourse[k] = { done: perCourseDone[k] ?? 0, total: perCourseTotal[k] };
  }

  const streak = computeStreak();

  return {
    totalCompleted: completed,
    totalLessons: total,
    xp,
    level,
    xpInLevel,
    xpForNextLevel,
    streak,
    badges,
    perCourse,
    isLoading,
    refresh,
  };
}
