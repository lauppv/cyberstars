import { useCallback } from 'react';
import * as progressService from '../services/progressService';
import { useAuth } from '../context/AuthContext';
import { useAllProgress } from '../context/ProgressContext';
import type { CourseProgress } from '@cyberstars/shared/progress';
import type { CodeLanguage } from '@cyberstars/shared/constants';

export function useProgress(courseKey: string) {
  const { isLoggedIn } = useAuth();
  const { progressMap, isLoading, refresh } = useAllProgress();

  const progress: CourseProgress | null = progressMap[courseKey] ?? null;

  // `language` names the code's language on a multi-language course.
  const saveCode = useCallback(
    async (lessonSlug: string, code: string, language?: CodeLanguage) => {
      if (!isLoggedIn) return;
      await progressService.saveCode(courseKey, lessonSlug, code, language);
    },
    [isLoggedIn, courseKey],
  );

  return { progress, isLoading, saveCode, loadProgress: refresh };
}
