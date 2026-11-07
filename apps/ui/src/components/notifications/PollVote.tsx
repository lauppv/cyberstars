import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import * as pollsService from '../../services/pollsService';
import { ApiClientError } from '../../services/apiClient';
import { POLL_ANSWER_MAX_LENGTH, type PollDTO } from '@cyberstars/shared/polls';

// A poll's question and options: tick one or more and vote, once and
// anonymously. The body of the bell's window and of the dashboard's
export function PollVote({ pollId }: { pollId: number }) {
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

  return (
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
                  className="btn btn-primary"
                >
                  {sending ? t('poll.voting') : t('poll.vote')}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
