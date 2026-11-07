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
    // the Enter that ends an answer to input() must not stop the program. A tint
    // of the error's red in Run's own shape, so it reads as stop without shouting
    // and the toolbar doesn't jump when it swaps.
    return (
      <button
        key="stop"
        data-track="stop-run"
        onClick={onStop}
        title={t('code.stopTitle')}
        className={`px-[15px] py-[5px] rounded-[var(--radius-sm)] border border-[var(--error)]/40 bg-[var(--error)]/10 text-[var(--error)] font-semibold text-[13px] flex items-center gap-1.5 hover:bg-[var(--error)]/20 transition cursor-pointer ${className}`}
      >
        {t('code.stop')}
      </button>
    );
  }
  // A tint of the output's blue, a step below Run Tests, the lesson's main move
  return (
    <button
      key="run"
      data-track="run"
      onClick={onClick}
      disabled={isRunning}
      title={t('code.runTitle')}
      className={`px-[15px] py-[5px] rounded-[var(--radius-sm)] border border-[var(--output)]/45 bg-[var(--output)]/15 text-[var(--output)] font-semibold text-[13px] flex items-center gap-1.5 hover:bg-[var(--output)]/25 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer ${className}`}
    >
      {isRunning ? (
        <>
          <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {t('code.running')}
        </>
      ) : (
        <>{t('code.run')}</>
      )}
    </button>
  );
}
