import { useTranslation } from 'react-i18next';

interface RunButtonProps {
  onClick: () => void;
  isRunning: boolean;
  // While running the button turns into Stop, the student's Ctrl+C
  onStop?: () => void;
  className?: string;
}

export function RunButton({ onClick, isRunning, onStop, className = '' }: RunButtonProps) {
  const { t } = useTranslation();
  if (isRunning && onStop) {
    // Its own element, not Run's turned over, so the focus doesn't stay on it:
    // the Enter that ends an answer to input() must not stop the program.
    return (
      <button
        key="stop"
        data-track="stop-run"
        onClick={onStop}
        title={t('code.stopTitle')}
        className={`px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--error)] text-white font-semibold text-[13px] flex items-center gap-1.5 hover:brightness-110 transition cursor-pointer ${className}`}
      >
        {t('code.stop')}
      </button>
    );
  }
  return (
    <button
      key="run"
      data-track="run"
      onClick={onClick}
      disabled={isRunning}
      title={t('code.runTitle')}
      className={`px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--output)] text-black font-semibold text-[13px] flex items-center gap-1.5 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer ${className}`}
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
