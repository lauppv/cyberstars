import { useEffect, useState, useCallback } from "react";
import * as progressService from "../services/progressService";
import { useAuth } from "../context/AuthContext";
import type { CourseProgress } from "../../shared/progress";

export function useProgress(courseKey: string) {
  const { isLoggedIn } = useAuth();
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadProgress = useCallback(async () => {
    if (!isLoggedIn || !courseKey) return;
    setIsLoading(true);
    try {
      const data = await progressService.getCourseProgress(courseKey);
      setProgress(data);
    } catch {
      // not logged in or error
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, courseKey]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const markComplete = useCallback(async (lessonSlug: string) => {
    if (!isLoggedIn) return;
    await progressService.markLessonComplete(courseKey, lessonSlug);
    await loadProgress();
  }, [isLoggedIn, courseKey, loadProgress]);

  const saveCode = useCallback(async (lessonSlug: string, code: string) => {
    if (!isLoggedIn) return;
    await progressService.saveCode(courseKey, lessonSlug, code);
  }, [isLoggedIn, courseKey]);

  return { progress, isLoading, markComplete, saveCode, loadProgress };
}
