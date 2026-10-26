import { useTranslation } from 'react-i18next';

// What a list or a conversation that didn't load says in its place
export function LoadError({ text, onRetry }: { text: string; onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <div
      role="alert"
      className="panel p-4 flex items-center justify-between gap-3 text-[12px] text-[var(--error)]"
    >
      <span className="min-w-0">{text}</span>
      <button
        type="button"
        onClick={onRetry}
        className="shrink-0 px-3 py-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent text-[var(--text)] font-semibold cursor-pointer hover:bg-[var(--surface)] transition"
      >
        {t('common.retry')}
      </button>
    </div>
  );
}
