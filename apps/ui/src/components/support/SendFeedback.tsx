import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquarePlus } from 'lucide-react';
import { INPUT_CLS } from '../../constants/styles';
import * as supportService from '../../services/supportService';

// The page's look, or Laniakea's cockpit
const LOOKS = {
  page: {
    open: 'inline-flex items-center gap-1.5 bg-transparent border-none p-0 text-[12px] text-[var(--text3)] hover:text-[var(--accent)] cursor-pointer transition',
    field: INPUT_CLS + ' resize-y',
    send: 'px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[12px] font-semibold cursor-pointer border-none hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed',
    cancel:
      'px-4 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent text-[var(--text)] text-[12px] font-semibold cursor-pointer hover:bg-[var(--surface)] transition',
    sent: 'text-[12px] text-[var(--success)] font-semibold',
    error: 'text-[12px] text-[var(--error)] font-semibold',
  },
  laniakea: {
    open: 'inline-flex items-center gap-1.5 bg-transparent border-none p-0 text-[11px] lnk-dim hover:text-[#b8a6ff] cursor-pointer',
    field: 'lnk-field',
    send: 'lnk-btn lnk-btn-primary',
    cancel: 'lnk-btn',
    sent: 'text-[12px] lnk-teal font-semibold',
    error: 'text-[12px] font-semibold text-[#ff6b8a]',
  },
};

// A feedback ticket in a few clicks: what the student writes, then what it is
// about, so admins know where to look
export function SendFeedback({
  prompt,
  subject,
  context,
  look = 'page',
}: {
  prompt: string;
  subject: string;
  context?: string;
  look?: keyof typeof LOOKS;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const cls = LOOKS[look];

  if (sent) {
    return (
      <p role="status" className={`m-0 ${cls.sent}`}>
        {t('feedback.sent')}
      </p>
    );
  }

  if (!open) {
    return (
      <button type="button" className={cls.open} onClick={() => setOpen(true)}>
        <MessageSquarePlus size={14} /> {prompt}
      </button>
    );
  }

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setError('');
    try {
      await supportService.createTicket({
        type: 'FEEDBACK',
        subject: subject.slice(0, 200),
        message: context ? `${message.trim()}\n\n${context}` : message.trim(),
      });
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    // Keys typed here stay here, so a dialog's shortcuts don't fire
    <form onSubmit={send} onKeyDown={(e) => e.stopPropagation()} className="flex flex-col gap-2">
      <label className="text-[12px] font-semibold">
        {prompt}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('feedback.placeholder')}
          rows={3}
          autoFocus
          className={`${cls.field} mt-1.5 block`}
        />
      </label>
      <div className="flex items-center gap-2 flex-wrap">
        <button type="submit" className={cls.send} disabled={sending || !message.trim()}>
          {sending ? t('support.sending') : t('support.send')}
        </button>
        <button type="button" className={cls.cancel} onClick={() => setOpen(false)}>
          {t('common.cancel')}
        </button>
        {error && (
          <span role="alert" className={cls.error}>
            {error}
          </span>
        )}
      </div>
    </form>
  );
}
