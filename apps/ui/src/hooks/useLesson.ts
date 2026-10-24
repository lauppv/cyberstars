import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CodeLanguage } from '@cyberstars/shared/constants';
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

// `language` is the one picked on a multi-language course, whose every lesson
// comes in each language; other courses leave it out.
export function useLesson(courseKey: string, lessonSlug: string, language?: CodeLanguage) {
  const { isLoggedIn } = useAuth();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'ro' ? 'ro' : 'en';
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // starterCode: the code we ship as teachers, in the current language (Reset
  // target, and what a pristine editor follows on a language switch). savedCode:
  // the user's own code, if any; language-agnostic, never auto-translated.
  const [starterCode, setStarterCode] = useState('');
  const [savedCode, setSavedCode] = useState<string | null>(null);
  // The request for the user's saved code failed: null savedCode then means
  // "not known", not "nothing saved".
  const [savedCodeFailed, setSavedCodeFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // The language of what is on screen. Switching it keeps the lesson up until
  // the other language's text has arrived, instead of a spinner.
  const [shownLanguage, setShownLanguage] = useState(language);

  // A lesson switch must flip isLoading within the same render: the fetch
  // effect below only sets it after the commit, and in that gap the page's
  // editor effect would populate the NEW lesson with the PREVIOUS lesson's
  // savedCode (stale isLoading=false + stale savedCode).
  const paramsKey = `${courseKey}/${lessonSlug}`;
  const [loadedKey, setLoadedKey] = useState(paramsKey);
  if (loadedKey !== paramsKey) {
    setLoadedKey(paramsKey);
    setIsLoading(true);
  }

  const loadedRef = useRef({ key: paramsKey, language });
  useEffect(() => {
    let cancelled = false;
    const switchingLanguage =
      loadedRef.current.key === paramsKey && loadedRef.current.language !== language;
    loadedRef.current = { key: paramsKey, language };
    setError(null); // eslint-disable-line react-hooks/set-state-in-effect
    if (!switchingLanguage) setIsLoading(true);

    const loadLesson = async () => {
      try {
        const lesson = await lessonService.fetchLesson(courseKey, lessonSlug, lang, language);
        if (cancelled) return;
        setTitle(lesson.title);
        setContent(lesson.content);
      } catch {
        if (cancelled) return;
        setError(t('lesson.notFound'));
        setTitle(t('lesson.notFound'));
        setContent('');
      }

      // Always resolve the starter so Reset has a target even when saved code exists.
      let starter: string;
      try {
        starter = await lessonService.fetchLessonCode(courseKey, lessonSlug, lang, language);
      } catch {
        starter = DEFAULT_CODE[(language ?? courseKey).toLowerCase()] || '';
      }
      if (cancelled) return;
      setStarterCode(starter);

      let saved: string | null = null;
      let failed = false;
      if (isLoggedIn) {
        try {
          const res = await progressService.getSavedCode(courseKey, lessonSlug, language);
          if (cancelled) return;
          saved = res.code;
        } catch {
          if (cancelled) return;
          failed = true;
        }
      }
      setSavedCode(saved);
      setSavedCodeFailed(failed);
      setShownLanguage(language);
      setIsLoading(false);
    };

    loadLesson();
    return () => {
      cancelled = true;
    };
  }, [courseKey, lessonSlug, isLoggedIn, lang, language, paramsKey, t]);

  // Asks again for saved code that failed to load, and gives it back (null
  // when nothing is saved); a failure throws and leaves it unknown.
  const reloadSavedCode = useCallback(async () => {
    const key = loadedRef.current;
    const res = await progressService.getSavedCode(courseKey, lessonSlug, shownLanguage);
    if (loadedRef.current !== key) return null;
    setSavedCode(res.code);
    setSavedCodeFailed(false);
    return res.code;
  }, [courseKey, lessonSlug, shownLanguage]);

  return {
    title,
    content,
    starterCode,
    savedCode,
    savedCodeFailed,
    reloadSavedCode,
    isLoading,
    error,
    language: shownLanguage,
  };
}
