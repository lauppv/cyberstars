import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Course } from "../../shared/lesson";
import { fetchCurriculum } from "../services/lessonService";

interface CurriculumContextType {
  courses: Course[];
  isLoading: boolean;
  refresh: () => void;
}

const CurriculumContext = createContext<CurriculumContextType | null>(null);

export function CurriculumProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    fetchCurriculum()
      .then((data) => { if (!cancelled) setCourses(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [refreshKey]);

  return (
    <CurriculumContext value={{ courses, isLoading, refresh }}>
      {children}
    </CurriculumContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCurriculum(): CurriculumContextType {
  const ctx = useContext(CurriculumContext);
  if (!ctx) throw new Error("useCurriculum must be used within CurriculumProvider");
  return ctx;
}
