import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// A lesson's saves of the student's code, `lessonKey` naming the lesson and
// language on screen. Save says how it went: "Code saved!" for a moment, or
// what went wrong until the next try. While the stored code is unknown, its
// load having failed, Save asks before replacing it and the lesson's own saves
// (a passing test run, a language switch) don't write.
export function useCodeSave(
  save: (code: string) => Promise<void>,
  savedCodeFailed: boolean,
  lessonKey: string,
) {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The student confirmed replacing this lesson's unknown stored code, and did.
  const [replaced, setReplaced] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const keyRef = useRef(lessonKey);

  const [shownKey, setShownKey] = useState(lessonKey);
  if (shownKey !== lessonKey) {
    setShownKey(lessonKey);
    setSaved(false);
    setError(null);
    setReplaced(false);
  }
  useEffect(() => {
    keyRef.current = lessonKey;
  }, [lessonKey]);

  const savedCodeUnknown = savedCodeFailed && !replaced;

  const saveNow = useCallback(
    async (code: string) => {
      if (savedCodeUnknown && !window.confirm(t('lesson.confirmReplaceSaved'))) return;
      const key = keyRef.current;
      setError(null);
      try {
        await save(code);
      } catch (err) {
        if (keyRef.current !== key) return;
        setSaved(false);
        setError(err instanceof Error && err.message ? err.message : t('common.somethingWrong'));
        return;
      }
      if (keyRef.current !== key) return;
      if (savedCodeUnknown) setReplaced(true);
      setSaved(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaved(false), 2000);
    },
    [savedCodeUnknown, save, t],
  );

  const autoSave = useCallback(
    (code: string) => {
      if (savedCodeUnknown) return;
      save(code).catch(() => {});
    },
    [savedCodeUnknown, save],
  );

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  return { save: saveNow, autoSave, saved, error, savedCodeUnknown };
}
