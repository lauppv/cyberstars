import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

/** The server's reason in the page's language, else a general one. */
function errMsg(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

// A small modal asking before blocking someone or reporting a message. It stays
// open while the request runs and shows why it failed, if it did. Rendered on
// the body: inside the messages panel it would be drawn behind it.
export function ConfirmDialog({
  title,
  confirmLabel,
  danger = false,
  onConfirm,
  onClose,
  children,
}: {
  title: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [busy, onClose]);

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(errMsg(err, t('common.somethingWrong')));
      setBusy(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 overlay z-[120] flex items-center justify-center p-4"
      onMouseDown={() => !busy && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-[440px] bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius-lg)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 pb-4">
          <div id="confirm-dialog-title" className="text-base font-bold">
            {title}
          </div>
          <div className="mt-2 text-[13px] text-[var(--text2)] leading-relaxed">{children}</div>
          {error && (
            <p role="alert" className="mt-3 text-[12px] text-[var(--error)]">
              {error}
            </p>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
          <button onClick={onClose} disabled={busy} className="btn btn-secondary">
            {t('messages.cancel')}
          </button>
          <button
            onClick={confirm}
            disabled={busy}
            className={`text-[13px] px-4 py-2 rounded-[var(--radius-sm)] font-semibold cursor-pointer border transition disabled:opacity-60 ${
              danger
                ? 'border-[var(--error)]/50 bg-[var(--error)]/15 text-[var(--error)] hover:bg-[var(--error)]/25'
                : 'border-[var(--border)] bg-[var(--accent)]/20 text-[var(--accent)] hover:bg-[var(--accent)]/30'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// Asks before blocking someone, saying what a block does
export function BlockDialog({
  name,
  onConfirm,
  onClose,
}: {
  name: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  return (
    <ConfirmDialog
      title={t('block.confirmTitle')}
      confirmLabel={t('block.block')}
      danger
      onConfirm={onConfirm}
      onClose={onClose}
    >
      {t('block.confirmText', { name })}
    </ConfirmDialog>
  );
}
