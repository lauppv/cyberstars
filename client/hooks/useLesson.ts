import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as lessonService from '../services/lessonService';
import * as progressService from '../services/progressService';
import { useAuth } from '../context/AuthContext';

const DEFAULT_CODE: Record<string, string> = {
  python: '# Python code goes here',
  'algo-python': '# Python code goes here',
  c: '#include <stdio.h>\nint main(void) {\n\n}',
  'algo-c': '#include <stdio.h>\nint main(void) {\n\n}',
  java: 'public class Main {\n  public static void main(String[] args) {\n\n  }\n}',
  'algo-java': 'public class Main {\n  public static void main(String[] args) {\n\n  }\n}',
};

export function useLesson(courseKey: string, lessonSlug: string) {
  const { isLoggedIn } = useAuth();
  const { i18n } = useTranslation();
  const lang = i18n.language === 'ro' ? 'ro' : 'en';
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // starterCode: the code we ship as teachers, in the current language (Reset
  // target, and what a pristine editor follows on a language switch). savedCode:
  // the user's own code, if any — language-agnostic, never auto-translated.
  const [starterCode, setStarterCode] = useState('');
  const [savedCode, setSavedCode] = useState<string | null>(null);
  // Worked-out solution markdown, or null when the lesson ships no solution file.
  const [solution, setSolution] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
    setError(null);

    const loadLesson = async () => {
      try {
        const lesson = await lessonService.fetchLesson(courseKey, lessonSlug, lang);
        if (cancelled) return;
        setTitle(lesson.title);
        setContent(lesson.content);
      } catch {
        if (cancelled) return;
        setError('Lesson not found');
        setTitle('Lesson not found');
        setContent('');
      }

      // Always resolve the starter so Reset has a target even when saved code exists.
      let starter: string;
      try {
        starter = await lessonService.fetchLessonCode(courseKey, lessonSlug, lang);
      } catch {
        starter = DEFAULT_CODE[courseKey.toLowerCase()] || '';
      }
      if (cancelled) return;
      setStarterCode(starter);

      try {
        const sol = await lessonService.fetchLessonSolution(courseKey, lessonSlug, lang);
        if (cancelled) return;
        setSolution(sol);
      } catch {
        if (cancelled) return;
        setSolution(null);
      }

      let saved: string | null = null;
      if (isLoggedIn) {
        try {
          const res = await progressService.getSavedCode(courseKey, lessonSlug);
          if (cancelled) return;
          saved = res.code;
        } catch {
          if (cancelled) return;
        }
      }
      setSavedCode(saved);
      setIsLoading(false);
    };

    loadLesson();
    return () => {
      cancelled = true;
    };
  }, [courseKey, lessonSlug, isLoggedIn, lang]);

  return { title, content, starterCode, savedCode, solution, isLoading, error };
}
