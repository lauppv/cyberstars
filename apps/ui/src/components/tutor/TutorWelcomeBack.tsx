import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useAllProgress } from '../../context/ProgressContext';
import { useTutor } from '../../context/TutorContext';
import { TutorToast } from './TutorToast';

// A student back after a week or more away gets a word from the tutor, once
// for that return: the browser keeps the last activity it was said for.
const AWAY_MS = 7 * 24 * 60 * 60 * 1000;
const KEY = 'cyberstars.welcomeBack';

function saidFor(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function TutorWelcomeBack() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const enabled = !!useTutor()?.enabled;
  const { progressMap, isLoading } = useAllProgress();
  const [now] = useState(Date.now);
  const [closed, setClosed] = useState(false);

  // When the student last did anything, if it was a week or more ago and the
  // tutor hasn't welcomed them back from it yet
  const away = useMemo(() => {
    if (!enabled || isLoading) return null;
    const last = Object.values(progressMap)
      .flatMap((c) => c.lessons.flatMap((l) => [l.lastAccessedAt, l.completedAt]))
      .reduce<string>((latest, at) => (at && at > latest ? at : latest), '');
    if (!last || now - Date.parse(last) < AWAY_MS || saidFor() === last) return null;
    return last;
  }, [enabled, isLoading, progressMap, now]);

  useEffect(() => {
    if (!away) return;
    try {
      localStorage.setItem(KEY, away);
    } catch {
      // Without storage it may say it again next time, which does no harm.
    }
  }, [away]);

  if (!away || closed) return null;
  const name = user?.name?.trim().split(/\s+/)[0];
  return (
    <TutorToast
      text={t('tutor.cheer.back', { name })}
      mood="happy"
      onClose={() => setClosed(true)}
    />
  );
}
