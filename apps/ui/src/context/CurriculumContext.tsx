import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Course } from '@cyberstars/shared/lesson';
import i18next from 'i18next';
import { fetchCurriculum, localizeCurriculum } from '../services/lessonService';

interface CurriculumContextType {
  courses: Course[];
  isLoading: boolean;
  refresh: () => void;
}

const CurriculumContext = createContext<CurriculumContextType | null>(null);

// `initialCourses` lets the build-time pre-render of the landing page draw
// with the real curriculum, since there the effect that fetches it never runs.
export function CurriculumProvider({
  children,
  initialCourses,
}: {
  children: ReactNode;
  initialCourses?: Course[];
}) {
  const [courses, setCourses] = useState<Course[]>(() =>
    localizeCurriculum(initialCourses ?? [], i18next.language),
  );
  const [isLoading, setIsLoading] = useState(!initialCourses);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    fetchCurriculum()
      .then((data) => {
        if (!cancelled) setCourses(localizeCurriculum(data, i18next.language));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return <CurriculumContext value={{ courses, isLoading, refresh }}>{children}</CurriculumContext>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCurriculum(): CurriculumContextType {
  const ctx = useContext(CurriculumContext);
  if (!ctx) throw new Error('useCurriculum must be used within CurriculumProvider');
  return ctx;
}
