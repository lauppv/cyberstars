import { useTranslation } from 'react-i18next';

// Marks a part still being built: a Beta course (BETA_COURSE_KEYS), or
// Laniakea with its own `hint`.
export function BetaBadge({ hint }: { hint?: string }) {
  const { t } = useTranslation();
  return (
    <span
      title={hint ?? t('common.betaHint')}
      className="inline-flex items-center px-2 py-0.5 rounded-full border border-[var(--border)] text-[11px] font-semibold text-[var(--text2)]"
    >
      {t('common.beta')}
    </span>
  );
}
