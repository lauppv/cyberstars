import { useId } from 'react';
import { useTranslation } from 'react-i18next';

// The card under the Dev mode button on a Web Development lesson that
// recommends it. It doesn't hold the page: the student can carry on around it.
export function DevModeHint({
  onClose,
  onCloseForGood,
}: {
  onClose: () => void;
  onCloseForGood: () => void;
}) {
  const { t } = useTranslation();
  const textId = useId();

  return (
    <div
      role="dialog"
      aria-describedby={textId}
      aria-label={t('lesson.devModeHint.label')}
      className="absolute right-0 top-full mt-2 w-72 z-50 p-3 flex flex-col gap-3 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] shadow-[0_8px_32px_#0008] fade-in-up"
    >
      <p id={textId} className="m-0 text-[13px] leading-relaxed text-[var(--text2)]">
        {t('lesson.devModeHint.text')}
      </p>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          data-track="dev-mode-hint-never"
          onClick={onCloseForGood}
          className="btn btn-secondary btn-sm"
        >
          {t('lesson.devModeHint.never')}
        </button>
        <button
          type="button"
          data-track="dev-mode-hint-ok"
          onClick={onClose}
          className="btn btn-primary btn-sm"
        >
          {t('lesson.devModeHint.ok')}
        </button>
      </div>
    </div>
  );
}
