import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useCurriculum } from './CurriculumContext';
import * as progressService from '../services/progressService';
import type { CourseProgress } from '../../shared/progress';

interface ProgressContextType {
  progressMap: Record<string, CourseProgress>;
  failedCourses: ReadonlySet<string>;
  isLoading: boolean;
  refresh: () => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const { courses, isLoading: curriculumLoading } = useCurriculum();
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgress>>({});
  const [failedCourses, setFailedCourses] = useState<ReadonlySet<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    if (curriculumLoading) return;
    if (!isLoggedIn || !courses.length) {
      setProgressMap({}); // eslint-disable-line react-hooks/set-state-in-effect
      setFailedCourses(new Set());
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const map: Record<string, CourseProgress> = {};
      const failed = new Set<string>();
      await Promise.all(
        courses.map(async (c) => {
          try {
            map[c.key] = await progressService.getCourseProgress(c.key);
          } catch {
            failed.add(c.key);
          }
        }),
      );
      if (!cancelled) {
        setProgressMap(map);
        setFailedCourses(failed);
        setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courses, curriculumLoading, isLoggedIn, refreshKey]);

  return (
    <ProgressContext value={{ progressMap, failedCourses, isLoading, refresh }}>
      {children}
    </ProgressContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAllProgress(): ProgressContextType {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useAllProgress must be used within ProgressProvider');
  return ctx;
}
