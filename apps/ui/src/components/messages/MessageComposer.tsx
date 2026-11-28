import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';

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
        className="p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        {/* The send button sits inside the box as an arrow, as in the tutor's panel */}
        <div className="relative">
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
            aria-label={t('messages.composerPlaceholder')}
            className="block w-full resize-none max-h-32 min-h-[44px] pl-4 pr-12 py-[11px] rounded-[22px] bg-[var(--glass)] border border-[var(--border)] text-[13.5px] leading-5 text-[var(--text)] placeholder:text-[var(--text3)] focus:outline-none focus:border-[var(--accent)]/60"
          />
          <button
            type="submit"
            disabled={!value.trim() || sending}
            title={t('messages.send')}
            aria-label={t('messages.send')}
            className="absolute right-1.5 bottom-1.5 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--accent)] text-white border-none hover:brightness-110 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowUp size={17} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </form>
      {error && (
        <p role="alert" className="px-3 pb-3 -mt-1 text-[12px] text-[var(--error)]">
          {error}
        </p>
      )}
    </div>
  );
}
