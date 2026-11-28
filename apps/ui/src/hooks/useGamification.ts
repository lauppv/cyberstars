import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCurriculum } from '../context/CurriculumContext';
import { useAllProgress } from '../context/ProgressContext';
import {
  isClosedCourse,
  levelFromXp,
  xpForLevel,
  levelTitleKey,
  xpForCourse,
} from '@cyberstars/shared/constants';
import { canAccessFeature } from '@cyberstars/shared/features';
import { PROJECT_LANGUAGES, PROJECT_XP, findProject } from '@cyberstars/shared/projects';
import { badgeId, courseBadges, projectBadges, type BadgeState } from '@cyberstars/shared/badges';
import * as projectsService from '../services/projectsService';
import { badgeLabel, badgeDescription } from '../components/gamification/badgeMeta';
import { courseTitle } from '../constants/courses';

interface BadgeDef extends BadgeState {
  id: string;
  label: string;
  description: string;
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

export function useGamification(): Gamification {
  const { t } = useTranslation();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const { courses: curriculum, isLoading: curriculumLoading } = useCurriculum();
  // A closed course earns no badge and adds to no total until it opens
  const courses = useMemo(() => curriculum.filter((c) => !isClosedCourse(c.key)), [curriculum]);
  const { progressMap, isLoading: progressLoading, refresh } = useAllProgress();
  const [tick, setTick] = useState(0);
  const forceRefresh = useCallback(() => {
    refresh();
    setTick((t) => t + 1);
  }, [refresh]);

  // Finished projects add their XP on top of the courses'. Only a student the
  // projects feature lets in has any; a failed read just leaves them out.
  const [projectXp, setProjectXp] = useState(0);
  // Finished projects per language; null until read, so a badge earned before isn't announced
  const [projectsDone, setProjectsDone] = useState<Record<string, number> | null>(null);
  const projectsOpen = isLoggedIn && canAccessFeature('projects', user?.role, import.meta.env.PROD);
  useEffect(() => {
    if (!projectsOpen) return;
    let live = true;
    projectsService
      .getCompletions()
      .then((done) => {
        if (!live) return;
        let xp = 0;
        const counts: Record<string, number> = {};
        for (const c of done) {
          const project = findProject(c.language, c.slug);
          if (!project) continue;
          xp += PROJECT_XP[project.difficulty];
          counts[project.language] = (counts[project.language] ?? 0) + 1;
        }
        setProjectXp(xp);
        setProjectsDone(counts);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [projectsOpen, tick]);

  const isLoading = authLoading || curriculumLoading || (isLoggedIn && progressLoading);

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
      totalXp += p?.totalXp ?? xpForCourse(c.key, c.lessons);
      pc[c.key] = { done, total };
    }

    earnedXp += projectsOpen ? projectXp : 0;
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
  }, [courses, progressMap, projectXp, projectsOpen]);

  const badges: BadgeDef[] = useMemo(() => {
    const result: BadgeDef[] = [];
    const add = (b: BadgeState, name: string) =>
      result.push({
        ...b,
        id: badgeId(b),
        label: badgeLabel(t, b, name),
        description: badgeDescription(t, b, name),
      });

    for (const c of courses) {
      const total = perCourse[c.key]?.total ?? 0;
      const done = new Set(
        progressMap[c.key]?.lessons.filter((l) => l.completed).map((l) => l.slug),
      );
      const partTitles = new Map(c.parts?.map((p) => [p.key, p.title]));
      for (const b of courseBadges(c.key, total, done, c.parts)) {
        add(b, b.kind === 'part' ? (partTitles.get(b.key) ?? b.key) : c.title);
      }
    }
    if (projectsOpen) {
      for (const language of PROJECT_LANGUAGES) {
        for (const b of projectBadges(language, projectsDone?.[language] ?? 0)) {
          add(b, courseTitle(language));
        }
      }
    }

    return result;
  }, [courses, perCourse, progressMap, projectsOpen, projectsDone, t]);

  const [newBadge, setNewBadge] = useState<BadgeDef | null>(null);
  const prevEarnedRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);
  // Project badges are new only once the completions were read before
  const projectsKnownRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    const earnedKeys = new Set(badges.filter((b) => b.earned).map((b) => b.id));
    if (initializedRef.current) {
      const prev = prevEarnedRef.current;
      // The last new one is the biggest: a finished station beats its last part
      const fresh = badges.filter(
        (b) => b.earned && !prev.has(b.id) && (b.kind !== 'project' || projectsKnownRef.current),
      );
      const badge = fresh.at(-1);
      if (badge) setTimeout(() => setNewBadge(badge), 0);
    }
    prevEarnedRef.current = earnedKeys;
    initializedRef.current = true;
    projectsKnownRef.current = projectsDone !== null;
  }, [badges, isLoading, projectsDone]);

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
