import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import * as pollsService from '../../services/pollsService';
import { ApiClientError } from '../../services/apiClient';
import { POLL_ANSWER_MAX_LENGTH, type PollDTO } from '@cyberstars/shared/polls';

// A poll opened from the bell: tick one or more options and vote, once and anonymously
export function PollModal({ pollId, onClose }: { pollId: number; onClose: () => void }) {
  const { t } = useTranslation();
  const [poll, setPoll] = useState<PollDTO | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [picked, setPicked] = useState<number[]>([]);
  const [answer, setAnswer] = useState('');
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [thanked, setThanked] = useState(false);

  useEffect(() => {
    let live = true;
    pollsService
      .getPoll(pollId)
      .then((p) => live && setPoll(p))
      .catch(() => live && setLoadFailed(true));
    return () => {
      live = false;
    };
  }, [pollId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggle = (id: number) =>
    setPicked((list) => (list.includes(id) ? list.filter((o) => o !== id) : [...list, id]));

  // Other ticked asks for the voter's own words before the vote can go
  const other = poll?.options.find((o) => o.writeIn);
  const writing = !!other && picked.includes(other.id);

  const vote = async () => {
    setSending(true);
    setFailed(false);
    try {
      await pollsService.vote(pollId, picked, writing ? answer.trim() : undefined);
      setThanked(true);
    } catch (err) {
      // Voted from another tab in the meantime
      if (err instanceof ApiClientError && err.status === 409) {
        setPoll((p) => p && { ...p, voted: true });
      } else {
        setFailed(true);
      }
    } finally {
      setSending(false);
    }
  };

  // A portal, so the sticky topbar's stacking can't keep it under the page
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('poll.title')}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] max-h-[85vh] overflow-y-auto bg-[var(--bg2)] border border-[var(--border)] rounded-xl"
      >
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[var(--border)] sticky top-0 bg-[var(--bg2)]">
          <div className="text-base font-bold">{t('poll.title')}</div>
          <button
            onClick={onClose}
            aria-label={t('notif.close')}
            className="w-8 h-8 flex-shrink-0 rounded-full border border-[var(--border)] bg-transparent text-[var(--text3)] text-base flex items-center justify-center cursor-pointer hover:text-[var(--text)] hover:border-[var(--text3)] transition"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5">
          {loadFailed ? (
            <p role="alert" className="m-0 text-[13px] text-[var(--error)]">
              {t('poll.loadFailed')}
            </p>
          ) : !poll ? (
            <p className="m-0 text-center text-[13px] text-[var(--text3)]">…</p>
          ) : (
            <>
              <p className="m-0 mb-4 text-[14px] font-semibold leading-relaxed text-[var(--text)] whitespace-pre-wrap break-words">
                {poll.question}
              </p>
              {thanked ? (
                <p role="status" className="m-0 text-[13px] text-[var(--text2)]">
                  {t('poll.thanks')}
                </p>
              ) : poll.voted ? (
                <p className="m-0 text-[13px] text-[var(--text2)]">{t('poll.voted')}</p>
              ) : (
                <>
                  <div role="group" aria-label={poll.question} className="flex flex-col gap-2">
                    {poll.options.map((o) => {
                      const on = picked.includes(o.id);
                      return (
                        <button
                          key={o.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggle(o.id)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-sm)] border text-left cursor-pointer transition ${
                            on
                              ? 'border-[var(--accent)] bg-[var(--surface2)]'
                              : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text3)]'
                          }`}
                        >
                          <span
                            className={`flex-shrink-0 grid place-items-center w-5 h-5 rounded border ${
                              on
                                ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                                : 'border-[var(--text3)]'
                            }`}
                          >
                            {on && <Check size={14} />}
                          </span>
                          <span className="text-[13px] text-[var(--text)] break-words min-w-0">
                            {o.writeIn ? t('poll.other') : o.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {writing && (
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows={3}
                      maxLength={POLL_ANSWER_MAX_LENGTH}
                      autoFocus
                      aria-label={t('poll.answer')}
                      placeholder={t('poll.answer')}
                      className="mt-2 w-full px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[13px] text-[var(--text)] outline-none focus:border-[var(--accent)]/60 transition resize-y"
                    />
                  )}
                  <p className="mt-3 mb-0 text-[12px] text-[var(--text3)]">
                    {other ? t('poll.hintOther') : t('poll.hint')}
                  </p>
                  {failed && (
                    <p role="alert" className="mt-3 mb-0 text-[13px] text-[var(--error)]">
                      {t('poll.failed')}
                    </p>
                  )}
                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={vote}
                      disabled={!picked.length || (writing && !answer.trim()) || sending}
                      className="text-[13px] px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {sending ? t('poll.voting') : t('poll.vote')}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
