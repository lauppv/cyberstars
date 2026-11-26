import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Plus, X } from 'lucide-react';
import * as adminService from '../../services/adminService';
import { announcementDay } from '../notifications/announcementDay';
import {
  POLL_MAX_OPTIONS,
  POLL_MIN_OPTIONS,
  POLL_OPTION_MAX_LENGTH,
  POLL_QUESTION_MAX_LENGTH,
  type PollResultsDTO,
} from '@cyberstars/shared/polls';

// The newest polls listed at first; the rest wait behind Show more
const SHOWN = 5;

const INPUT_CLS =
  'w-full px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[14px] text-[var(--text)] outline-none focus:border-[var(--accent)]/60 transition';

// A poll for every user's bell, sent after a last look, and how each one sent is going
export function PollSection({ className }: { className: string }) {
  const { t } = useTranslation();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(Array(POLL_MIN_OPTIONS).fill(''));
  // An Other after the options, where each voter writes their own answer
  const [other, setOther] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState<number | null>(null);
  // null until the history loads, so an empty one is only ever a real one
  const [history, setHistory] = useState<PollResultsDTO[] | null>(null);
  const [historyFailed, setHistoryFailed] = useState(false);
  const [all, setAll] = useState(false);
  // The polls opened to their results, by id; each starts as one line
  const [opened, setOpened] = useState<Set<number>>(new Set());

  const loadHistory = useCallback(() => {
    adminService
      .getPolls()
      .then((list) => {
        setHistory(list);
        setHistoryFailed(false);
      })
      .catch(() => setHistoryFailed(true));
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (!confirming) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setConfirming(false);
      setFailed(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [confirming]);

  // Options left empty are dropped, the same one twice is not
  const filled = options.map((o) => o.trim()).filter(Boolean);
  const repeated = new Set(filled).size !== filled.length;
  const ready = question.trim() !== '' && filled.length >= POLL_MIN_OPTIONS && !repeated;

  const setOption = (i: number, text: string) =>
    setOptions((list) => list.map((o, j) => (j === i ? text : o)));

  const close = () => {
    setConfirming(false);
    setFailed(false);
  };

  const send = async () => {
    setSending(true);
    setFailed(false);
    try {
      const res = await adminService.sendPoll(question.trim(), filled, other);
      setSent(res.sent);
      setQuestion('');
      setOptions(Array(POLL_MIN_OPTIONS).fill(''));
      setOther(false);
      setConfirming(false);
      loadHistory();
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  const toggle = (id: number) =>
    setOpened((ids) => {
      const next = new Set(ids);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <section className={className}>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={2}
        maxLength={POLL_QUESTION_MAX_LENGTH}
        aria-label={t('admin.poll.question')}
        placeholder={t('admin.poll.question')}
        className={INPUT_CLS + ' resize-y'}
      />
      <div className="mt-3 flex flex-col gap-2">
        {options.map((o, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={o}
              onChange={(e) => setOption(i, e.target.value)}
              maxLength={POLL_OPTION_MAX_LENGTH}
              aria-label={t('admin.poll.option', { n: i + 1 })}
              placeholder={t('admin.poll.option', { n: i + 1 })}
              className={INPUT_CLS}
            />
            {options.length > POLL_MIN_OPTIONS && (
              <button
                onClick={() => setOptions((list) => list.filter((_, j) => j !== i))}
                aria-label={t('admin.poll.removeOption', { n: i + 1 })}
                className="w-8 h-8 flex-shrink-0 grid place-items-center rounded-[var(--radius-sm)] bg-transparent border border-[var(--border)] text-[var(--text3)] hover:text-[var(--text)] transition cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      {repeated && (
        <p className="mt-2 mb-0 text-[12px] text-[var(--error)]">{t('admin.poll.repeated')}</p>
      )}
      <label className="mt-3 flex items-center gap-2 text-[13px] text-[var(--text2)] cursor-pointer">
        <input
          type="checkbox"
          checked={other}
          onChange={(e) => setOther(e.target.checked)}
          className="accent-[var(--accent)] w-4 h-4"
        />
        {t('admin.poll.addOther')}
      </label>
      <div className="mt-3 flex items-center justify-end gap-3">
        {sent !== null && (
          <span role="status" className="mr-auto text-[12px] text-[var(--text3)]">
            {t('admin.poll.sent', { count: sent })}
          </span>
        )}
        <button
          onClick={() => setOptions((list) => [...list, ''])}
          disabled={options.length >= POLL_MAX_OPTIONS}
          className="btn btn-secondary"
        >
          <Plus size={14} />
          {t('admin.poll.addOption')}
        </button>
        <button
          onClick={() => {
            setSent(null);
            setConfirming(true);
          }}
          disabled={!ready}
          className="btn btn-primary"
        >
          {t('admin.poll.send')}
        </button>
      </div>

      <h3 className="mt-6 mb-2 text-[12px] font-semibold text-[var(--text2)]">
        {t('admin.poll.history')}
      </h3>
      {historyFailed ? (
        <p className="m-0 text-[12px] text-[var(--error)]">{t('admin.poll.historyError')}</p>
      ) : history === null ? null : history.length === 0 ? (
        <p className="m-0 text-[12px] text-[var(--text3)]">{t('admin.poll.none')}</p>
      ) : (
        <>
          <ul className="m-0 p-0 list-none border-t border-[var(--border)]">
            {(all ? history : history.slice(0, SHOWN)).map((p) => {
              const open = opened.has(p.id);
              return (
                <li key={p.id} className="border-b border-[var(--border)]">
                  <button
                    onClick={() => toggle(p.id)}
                    aria-expanded={open}
                    className="w-full flex items-start gap-2 text-left px-2 py-2.5 bg-transparent border-none cursor-pointer hover:bg-[var(--surface)] transition"
                  >
                    <ChevronRight
                      size={14}
                      aria-hidden="true"
                      className={`mt-0.5 flex-shrink-0 text-[var(--text3)] transition-transform ${open ? 'rotate-90' : ''}`}
                    />
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold text-[var(--text)] break-words">
                        {p.question}
                      </span>
                      <span className="block mt-0.5 text-[11px] text-[var(--text3)]">
                        {announcementDay(p.createdAt)} · {p.authorName ?? t('notif.someone')} ·{' '}
                        {t('admin.poll.voters', { voters: p.voters, recipients: p.recipients })}
                      </span>
                    </span>
                  </button>
                  {open && (
                    <div className="pl-8 pr-2 pb-3">
                      {/* Counts only, never who. The polls sent before opening one was counted have no line */}
                      {p.viewers !== null && (
                        <span className="block text-[11px] text-[var(--text3)]">
                          {t('admin.poll.ignored', {
                            ignored: p.viewers - p.voters,
                            unopened: p.recipients - p.viewers,
                          })}
                        </span>
                      )}
                      <ul className="mt-2.5 mb-0 p-0 list-none flex flex-col gap-2">
                        {p.options.map((o) => {
                          // A share of the voters, so with several picks each the shares add up past 100%
                          const pct = p.voters ? Math.round((o.votes / p.voters) * 100) : 0;
                          return (
                            <li key={o.id}>
                              <div className="flex items-baseline justify-between gap-3 text-[12px]">
                                <span className="text-[var(--text2)] break-words min-w-0">
                                  {o.writeIn ? t('admin.poll.other') : o.text}
                                </span>
                                <span className="flex-shrink-0 tabular-nums text-[var(--text3)]">
                                  {o.votes} · {pct}%
                                </span>
                              </div>
                              <div
                                aria-hidden="true"
                                className="mt-1 h-1.5 rounded-full bg-[var(--surface)] overflow-hidden"
                              >
                                {/* A vote cast before only students counted can take an option past its voters */}
                                <div
                                  className="h-full rounded-full bg-[var(--accent)]"
                                  style={{ width: `${Math.min(pct, 100)}%` }}
                                />
                              </div>
                              {o.writeIn && p.answers.length > 0 && (
                                <ul
                                  aria-label={t('admin.poll.answers')}
                                  className="mt-2 mb-0 p-0 list-none flex flex-col gap-1.5"
                                >
                                  {p.answers.map((a, i) => (
                                    <li
                                      key={i}
                                      className="px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface)] text-[12px] text-[var(--text2)] whitespace-pre-wrap break-words"
                                    >
                                      {a}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {!all && history.length > SHOWN && (
            <button onClick={() => setAll(true)} className="btn btn-secondary btn-sm mt-3">
              {t('admin.showMore')}
            </button>
          )}
        </>
      )}

      {confirming &&
        createPortal(
          <div
            className="fixed inset-0 overlay z-[100] flex items-center justify-center p-4"
            onMouseDown={close}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={t('admin.poll.confirmTitle')}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] max-h-[85vh] overflow-y-auto bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius-lg)] px-6 py-5"
            >
              <div className="text-base font-bold">{t('admin.poll.confirmTitle')}</div>
              <p className="mt-1 mb-4 text-[12px] text-[var(--text3)]">
                {t('admin.poll.confirmHint')}
              </p>
              <p className="m-0 text-[14px] font-semibold text-[var(--text)] whitespace-pre-wrap break-words">
                {question.trim()}
              </p>
              <ul className="mt-2 mb-0 pl-5 text-[13px] text-[var(--text2)]">
                {filled.map((o) => (
                  <li key={o} className="break-words">
                    {o}
                  </li>
                ))}
                {other && <li>{t('admin.poll.otherOption')}</li>}
              </ul>
              {failed && (
                <p role="alert" className="mt-4 mb-0 text-[13px] text-[var(--error)]">
                  {t('admin.poll.failed')}
                </p>
              )}
              <div className="mt-5 flex items-center justify-end gap-2">
                <button onClick={close} className="btn btn-secondary">
                  {t('admin.poll.cancel')}
                </button>
                <button onClick={send} disabled={sending} className="btn btn-primary">
                  {sending ? t('admin.poll.sending') : t('admin.poll.send')}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
