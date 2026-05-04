import { useEffect, useState } from "react";
import { fetchCurriculum } from "../services/lessonService";
import * as progressService from "../services/progressService";
import { useAuth } from "../context/AuthContext";

const XP_PER_LESSON = 15;
const XP_PER_LEVEL = 300;

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
  isLoading: boolean;
}

export function useGamification(): Gamification {
  const { isLoggedIn } = useAuth();
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [perCourseDone, setPerCourseDone] = useState<Record<string, number>>({});
  const [perCourseTotal, setPerCourseTotal] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

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
  }, [isLoggedIn]);

  const xp = completed * XP_PER_LESSON;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInLevel = xp % XP_PER_LEVEL;
  const xpForNextLevel = XP_PER_LEVEL;

  const aCourseFullyComplete = Object.keys(perCourseTotal).some(
    (k) => perCourseTotal[k] > 0 && perCourseDone[k] === perCourseTotal[k]
  );

  const badges: BadgeDef[] = [
    { icon: "🐍", label: "First Code", earned: completed >= 1 },
    { icon: "⚡", label: "Speed Run", earned: completed >= 5 },
    { icon: "🧠", label: "Bug Squasher", earned: completed >= 10 },
    { icon: "🌟", label: "Perfect Score", earned: aCourseFullyComplete },
  ];

  return {
    totalCompleted: completed,
    totalLessons: total,
    xp,
    level,
    xpInLevel,
    xpForNextLevel,
    streak: 1,
    badges,
    isLoading,
  };
}
