import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// onSend throws when the message wasn't sent; the thread says why through `error`
export function MessageComposer({
  onSend,
  error,
}: {
  onSend: (content: string) => Promise<void>;
  error: string | null;
}) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async () => {
    const content = value.trim();
    if (!content || sending) return;
    setSending(true);
    try {
      await onSend(content);
      setValue('');
    } catch {
      /* keep the text so the user can retry */
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-t border-[var(--border)]">
      <form
        className="flex items-end gap-2 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void submit();
            }
          }}
          rows={1}
          maxLength={2000}
          placeholder={t('messages.composerPlaceholder')}
          className="flex-1 resize-none max-h-32 min-h-[40px] px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--glass)] border border-[var(--border)] text-[13px] text-[var(--text)] placeholder:text-[var(--text3)] focus:outline-none focus:border-[var(--accent)]/60"
        />
        <button
          type="submit"
          disabled={!value.trim() || sending}
          className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          {t('messages.send')}
        </button>
      </form>
      {error && (
        <p role="alert" className="px-3 pb-3 -mt-1 text-[12px] text-[var(--error)]">
          {error}
        </p>
      )}
    </div>
  );
}
