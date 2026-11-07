import { useTranslation } from 'react-i18next';

export function LoadingSpinner() {
  const { t } = useTranslation();
  return (
    <div role="status" className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      <span className="sr-only">{t('common.loading')}</span>
    </div>
  );
}
