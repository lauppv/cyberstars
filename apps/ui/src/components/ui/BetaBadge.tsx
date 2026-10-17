import { useTranslation } from 'react-i18next';

// Marks a course still being built (BETA_COURSE_KEYS).
export function BetaBadge() {
  const { t } = useTranslation();
  return (
    <span
      title={t('common.betaHint')}
      className="inline-flex items-center px-2 py-0.5 rounded-full border border-[var(--border)] text-[11px] font-semibold text-[var(--text2)]"
    >
      {t('common.beta')}
    </span>
  );
}
