import { useTranslation } from 'react-i18next';
import type { TutorLookupStatus } from '../../context/TutorContext';

// What the tutor is doing before its first words: the lookup the server last
// named, or before any, reading the student's work in a lesson chat and
// thinking in a general one
export function TutorStatus({
  lookup,
  lesson,
}: {
  lookup: TutorLookupStatus | null;
  lesson: boolean;
}) {
  const { t } = useTranslation();
  let text: string;
  if (!lookup) text = t(lesson ? 'tutor.status.work' : 'tutor.status.think');
  else if (lookup.lookup === 'read' && lookup.title) {
    text = t('tutor.status.readTitle', { title: lookup.title });
  } else text = t(`tutor.status.${lookup.lookup}`);

  return (
    <p role="status" className="text-[13px]">
      <span className="animate-glimmer">{text}</span>
    </p>
  );
}
