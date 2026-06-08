import { useTranslation } from 'react-i18next';

interface RunButtonProps {
  onClick: () => void;
  isRunning: boolean;
  className?: string;
}

export function RunButton({ onClick, isRunning, className = '' }: RunButtonProps) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      disabled={isRunning}
      title={t('code.runTitle')}
      className={`px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--success)] text-black font-semibold text-[13px] flex items-center gap-1.5 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer ${className}`}
    >
      {isRunning ? (
        <>
          <span className="inline-block w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
          {t('code.running')}
        </>
      ) : (
        <>{t('code.run')}</>
      )}
    </button>
  );
}
