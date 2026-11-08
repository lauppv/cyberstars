import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WEB_COURSE_KEYS, type CodeLanguage } from '@cyberstars/shared/constants';
import * as lessonService from '../services/lessonService';
import * as progressService from '../services/progressService';
import { fetchWebLessonStart } from '../services/webLessonService';
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
  // courseStarter: the code we ship as teachers, in the current language; on a
  // web lesson the course's site so far with the lesson's new files (CYB-119).
  // passedStarter: a web lesson's start from the student's own passing site
  // instead, null without one. starterCode is the student's when there is one
  // (Reset target, and what a pristine editor follows on a language switch).
  // savedCode: the user's own code, if any; language-agnostic, never
  // auto-translated.
  const [courseStarter, setCourseStarter] = useState('');
  const [passedStarter, setPassedStarter] = useState<string | null>(null);
  const starterCode = passedStarter ?? courseStarter;
  // A web lesson's start couldn't be read: its starter is then only the
  // lesson's own files, without the site from the lessons before.
  const [startFailed, setStartFailed] = useState(false);
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

    // The lesson's text, its starter and the student's saved code don't wait
    // on each other, so they're asked for together
    const loadText = lessonService
      .fetchLesson(courseKey, lessonSlug, lang, language)
      .catch(() => null);
    // Always resolve the starter so Reset has a target even when saved code exists.
    const loadStarter = async () => {
      let failed = false;
      if (WEB_COURSE_KEYS.includes(courseKey)) {
        try {
          return { ...(await fetchWebLessonStart(courseKey, lessonSlug, lang)), failed };
        } catch {
          // The lesson's own files are the closest there is to its start,
          // and the page says the rest is missing
          failed = true;
        }
      }
      try {
        const own = await lessonService.fetchLessonCode(courseKey, lessonSlug, lang, language);
        return { course: own, passed: null, failed };
      } catch {
        const course = DEFAULT_CODE[(language ?? courseKey).toLowerCase()] || '';
        return { course, passed: null, failed };
      }
    };
    const loadSaved = isLoggedIn
      ? progressService.getSavedCode(courseKey, lessonSlug, language).then(
          (res) => ({ code: res.code, failed: false }),
          () => ({ code: null, failed: true }),
        )
      : Promise.resolve({ code: null, failed: false });

    const loadLesson = async () => {
      const [lesson, starter, saved] = await Promise.all([loadText, loadStarter(), loadSaved]);
      if (cancelled) return;
      if (lesson) {
        setTitle(lesson.title);
        setContent(lesson.content);
      } else {
        setError(t('lesson.notFound'));
        setTitle(t('lesson.notFound'));
        setContent('');
      }
      setCourseStarter(starter.course);
      setPassedStarter(starter.passed);
      setStartFailed(starter.failed);
      setSavedCode(saved.code);
      setSavedCodeFailed(saved.failed);
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

  // Asks again for a web lesson's start that failed to load; a failure throws
  // and leaves the lesson's own files as its starter.
  const reloadStart = useCallback(async () => {
    const key = loadedRef.current;
    const start = await fetchWebLessonStart(courseKey, lessonSlug, lang);
    if (loadedRef.current !== key) return;
    setCourseStarter(start.course);
    setPassedStarter(start.passed);
    setStartFailed(false);
  }, [courseKey, lessonSlug, lang]);

  return {
    title,
    content,
    starterCode,
    courseStarter,
    passedStarter,
    startFailed,
    reloadStart,
    savedCode,
    savedCodeFailed,
    reloadSavedCode,
    isLoading,
    error,
    language: shownLanguage,
  };
}
