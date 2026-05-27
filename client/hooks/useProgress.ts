import { useCallback } from 'react';
import * as progressService from '../services/progressService';
import { useAuth } from '../context/AuthContext';
import { useAllProgress } from '../context/ProgressContext';
import type { CourseProgress } from '../../shared/progress';

export function useProgress(courseKey: string) {
  const { isLoggedIn } = useAuth();
  const { progressMap, isLoading, refresh } = useAllProgress();

  const progress: CourseProgress | null = progressMap[courseKey] ?? null;

  const markComplete = useCallback(
    async (lessonSlug: string) => {
      if (!isLoggedIn) return;
      await progressService.markLessonComplete(courseKey, lessonSlug);
      refresh();
    },
    [isLoggedIn, courseKey, refresh],
  );

  const saveCode = useCallback(
    async (lessonSlug: string, code: string) => {
      if (!isLoggedIn) return;
      await progressService.saveCode(courseKey, lessonSlug, code);
    },
    [isLoggedIn, courseKey],
  );

  return { progress, isLoading, markComplete, saveCode, loadProgress: refresh };
}
