import { useEffect, useState } from 'react';
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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [codeTemplate, setCodeTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
    setError(null);

    const loadLesson = async () => {
      try {
        const lesson = await lessonService.fetchLesson(courseKey, lessonSlug);
        if (cancelled) return;
        setTitle(lesson.title);
        setContent(lesson.content);
      } catch {
        if (cancelled) return;
        setError('Lesson not found');
        setTitle('Lesson not found');
        setContent('');
      }

      try {
        if (isLoggedIn) {
          const saved = await progressService.getSavedCode(courseKey, lessonSlug);
          if (cancelled) return;
          if (saved.code) {
            setCodeTemplate(saved.code);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        if (cancelled) return;
      }

      try {
        const code = await lessonService.fetchLessonCode(courseKey, lessonSlug);
        if (cancelled) return;
        setCodeTemplate(code);
      } catch {
        if (cancelled) return;
        setCodeTemplate(DEFAULT_CODE[courseKey.toLowerCase()] || '');
      }

      setIsLoading(false);
    };

    loadLesson();
    return () => {
      cancelled = true;
    };
  }, [courseKey, lessonSlug, isLoggedIn]);

  return { title, content, codeTemplate, isLoading, error };
}
