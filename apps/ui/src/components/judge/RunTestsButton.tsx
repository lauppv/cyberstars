import { useTranslation } from 'react-i18next';

// The lesson's main move: the judge's verdict on the code (or a web lesson's
// site), solid purple, a step above Run
export function RunTestsButton({
  onClick,
  isTesting,
  disabled = false,
}: {
  onClick: () => void;
  isTesting: boolean;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <button
      data-track="run-tests"
      onClick={onClick}
      disabled={isTesting || disabled}
      className="px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white font-semibold text-[13px] flex items-center gap-1.5 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
    >
      {isTesting ? (
        <>
          <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {t('tests.running')}
        </>
      ) : (
        <>{t('tests.run')}</>
      )}
    </button>
  );
}
