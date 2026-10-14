import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// What the tutor may be doing before its first words, in order. It moves on
// every few seconds and stays on the last entry.
const STATUS_KEYS = [
  'tutor.status.lesson',
  'tutor.status.code',
  'tutor.status.search',
  'tutor.status.think',
  'tutor.status.write',
] as const;

const STATUS_STEP_MS = 3000;

export function TutorStatus() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= STATUS_KEYS.length - 1) return;
    const timer = setTimeout(() => setStep((s) => s + 1), STATUS_STEP_MS);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <p role="status" className="text-[13px]">
      <span className="animate-glimmer">{t(STATUS_KEYS[step])}</span>
    </p>
  );
}
