import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../context/NotificationContext';
import { useUserSocketFrames } from '../../context/UserSocketContext';
import * as notificationsService from '../../services/notificationsService';
import { announcementDay } from './announcementDay';
import { PollVote } from './PollVote';
import { NOTICE_TYPES } from '@cyberstars/shared/notifications';
import type { NotificationDTO, UserSocketFrame } from '@cyberstars/shared/notifications';

const secondary =
  'text-[13px] px-4 py-2 rounded-[var(--radius-sm)] bg-transparent border border-[var(--border)] text-[var(--text2)] font-semibold hover:text-[var(--text)] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const primary =
  'text-[13px] px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white font-semibold hover:brightness-110 transition cursor-pointer';

// The announcements and polls the admins and the founder sent, opened over the
// dashboard one at a time, oldest first: on arrival there, and at once when one
// comes in while the student is on it. Each one on screen is read. Closing the
// window marks the whole set shown, so it never opens with them again and the
// ones skipped wait unread in the bell. `held` keeps it shut while another
// window is open on the dashboard.
export function DashboardNotices({ held = false }: { held?: boolean }) {
  const { t } = useTranslation();
  const { enabled, noteRead } = useNotifications();
  const [notices, setNotices] = useState<NotificationDTO[]>([]);
  const [at, setAt] = useState(0);
  // The furthest one shown, so the rest count as not seen yet
  const [reached, setReached] = useState(0);
  const [confirming, setConfirming] = useState(false);
  // Those this window marked read or shown, so a load still on its way, or one
  // a live notice starts while the shown mark is, never brings them back
  const read = useRef(new Set<number>());
  const closed = useRef(new Set<number>());

  // Oldest first and each once: a later load only adds the newer ones, after
  // those on screen
  const load = useCallback(() => {
    notificationsService
      .getNotices()
      .then((list) =>
        setNotices((prev) => {
          const have = new Set(prev.map((n) => n.id));
          const more = list.filter((n) => !have.has(n.id) && !closed.current.has(n.id));
          return more.length ? [...prev, ...more].sort((a, b) => a.id - b.id) : prev;
        }),
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  const onFrame = useCallback(
    (frame: UserSocketFrame) => {
      if (frame.channel === 'notification' && frame.type === 'new') {
        if (NOTICE_TYPES.includes(frame.payload.type)) load();
      }
    },
    [load],
  );
  useUserSocketFrames(onFrame);

  const open = notices.length > 0 && !held;
  const current = open ? notices[at] : undefined;

  useEffect(() => {
    if (!current || read.current.has(current.id)) return;
    read.current.add(current.id);
    notificationsService.markOneRead(current.id).catch(() => {});
    noteRead(current.id);
  }, [current, noteRead]);

  const close = useCallback(() => {
    const ids = notices.map((n) => n.id);
    for (const id of ids) closed.current.add(id);
    notificationsService.markShown(ids).catch(() => {});
    setNotices([]);
    setAt(0);
    setReached(0);
    setConfirming(false);
  }, [notices]);

  // Escape asks like the X, and a second one takes the question back
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConfirming((c) => !c);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!current) return null;

  const total = notices.length;
  const last = at === total - 1;
  const unseen = total - 1 - reached;
  const poll = current.type === 'POLL';
  const title = poll ? t('poll.title') : t('notif.announcementTitle');
  // On a poll its Vote is the one to press, so Next and Done step back
  const onward = poll ? secondary : primary;
  const go = (to: number) => {
    setAt(to);
    setReached((r) => Math.max(r, to));
  };

  // A portal, so the sticky topbar's stacking can't keep it under the page. A
  // click beside it doesn't close it, only the X or Done
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-[560px] max-h-[85vh] flex flex-col bg-[var(--bg2)] border border-[var(--border)] rounded-xl"
      >
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[var(--border)]">
          <div className="min-w-0">
            <div className="text-base font-bold">{title}</div>
            <div className="text-[12px] text-[var(--text3)]">
              {announcementDay(current.createdAt)}
            </div>
          </div>
          <button
            onClick={() => setConfirming(true)}
            aria-label={t('notif.close')}
            className="w-8 h-8 flex-shrink-0 rounded-full border border-[var(--border)] bg-transparent text-[var(--text3)] text-base flex items-center justify-center cursor-pointer hover:text-[var(--text)] hover:border-[var(--text3)] transition"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto">
          {poll ? (
            <PollVote key={current.id} pollId={current.entityId} />
          ) : (
            <p className="m-0 px-6 py-5 text-[14px] leading-relaxed text-[var(--text)] whitespace-pre-wrap break-words">
              {current.data?.text ?? ''}
            </p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[var(--border)]">
          {confirming ? (
            <>
              <p role="status" className="m-0 text-[13px] text-[var(--text2)]">
                {[
                  t('notices.closeQuestion'),
                  unseen > 0 && t('notices.unseen', { count: unseen }),
                  t('notices.inBell', { count: total }),
                ]
                  .filter(Boolean)
                  .join(' ')}
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <button onClick={() => setConfirming(false)} className={secondary}>
                  {t('notices.stay')}
                </button>
                <button onClick={close} className={primary}>
                  {t('notif.close')}
                </button>
              </div>
            </>
          ) : total === 1 ? (
            <div className="flex justify-end">
              <button onClick={close} className={onward}>
                {t('notices.done')}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => go(at - 1)} disabled={at === 0} className={secondary}>
                {t('notices.back')}
              </button>
              <span className="text-[12px] text-[var(--text3)] tabular-nums">
                {t('notices.counter', { at: at + 1, total })}
              </span>
              {last ? (
                <button onClick={close} className={onward}>
                  {t('notices.done')}
                </button>
              ) : (
                <button onClick={() => go(at + 1)} className={onward}>
                  {t('notices.next')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
