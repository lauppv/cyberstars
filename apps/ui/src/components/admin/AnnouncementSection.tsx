import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import * as adminService from '../../services/adminService';
import { NotificationItem } from '../notifications/NotificationDropdown';
import { AnnouncementModal } from '../notifications/AnnouncementModal';
import { announcementDay } from '../notifications/announcementDay';
import { ANNOUNCEMENT_MAX_LENGTH, type NotificationDTO } from '@cyberstars/shared/notifications';
import type { AnnouncementDTO } from '@cyberstars/shared/admin';

// An official announcement for every user's bell, sent only after a look at how it shows there
export function AnnouncementSection({ className }: { className: string }) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<NotificationDTO | null>(null);
  const [reading, setReading] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState<number | null>(null);
  // null until the history loads, so an empty one is only ever a real one
  const [history, setHistory] = useState<AnnouncementDTO[] | null>(null);
  const [historyFailed, setHistoryFailed] = useState(false);
  const [past, setPast] = useState<AnnouncementDTO | null>(null);

  const loadHistory = useCallback(() => {
    adminService
      .getAnnouncements()
      .then((list) => {
        setHistory(list);
        setHistoryFailed(false);
      })
      .catch(() => setHistoryFailed(true));
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const close = () => {
    setPreview(null);
    setFailed(false);
  };

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => {
      // The full text on top closes first
      if (e.key !== 'Escape' || reading) return;
      setPreview(null);
      setFailed(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [preview, reading]);

  const openPreview = () => {
    setSent(null);
    setPreview({
      id: 0,
      type: 'ANNOUNCEMENT',
      entityId: 0,
      data: { text: text.trim() },
      actor: null,
      readAt: null,
      createdAt: new Date().toISOString(),
    });
  };

  const send = async () => {
    setSending(true);
    setFailed(false);
    try {
      const res = await adminService.sendAnnouncement(text.trim());
      setSent(res.sent);
      setText('');
      setPreview(null);
      loadHistory();
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className={className}>
      <h2 className="text-[14px] font-semibold mb-4">{t('admin.announcement.title')}</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        maxLength={ANNOUNCEMENT_MAX_LENGTH}
        aria-label={t('admin.announcement.title')}
        placeholder={t('admin.announcement.placeholder')}
        className="w-full px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[14px] text-[var(--text)] outline-none focus:border-[var(--accent)]/60 transition resize-y"
      />
      <div className="mt-3 flex items-center justify-end gap-3">
        {sent !== null && (
          <span role="status" className="mr-auto text-[12px] text-[var(--text3)]">
            {t('admin.announcement.sent', { count: sent })}
          </span>
        )}
        <button
          onClick={openPreview}
          disabled={!text.trim()}
          className="px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {t('admin.announcement.send')}
        </button>
      </div>

      <h3 className="mt-6 mb-2 text-[12px] font-semibold text-[var(--text2)]">
        {t('admin.announcement.history')}
      </h3>
      {historyFailed ? (
        <p className="m-0 text-[12px] text-[var(--error)]">
          {t('admin.announcement.historyError')}
        </p>
      ) : history === null ? null : history.length === 0 ? (
        <p className="m-0 text-[12px] text-[var(--text3)]">{t('admin.announcement.none')}</p>
      ) : (
        <ul className="m-0 p-0 list-none border-t border-[var(--border)]">
          {history.map((a) => (
            <li key={a.id} className="border-b border-[var(--border)]">
              <button
                onClick={() => setPast(a)}
                className="w-full text-left px-2 py-2.5 bg-transparent border-none cursor-pointer hover:bg-[var(--surface)] transition"
              >
                <span className="text-[13px] text-[var(--text)] line-clamp-2">{a.text}</span>
                <span className="block mt-0.5 text-[11px] text-[var(--text3)]">
                  {announcementDay(a.createdAt)} · {a.authorName ?? t('notif.someone')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {past && (
        <AnnouncementModal
          text={past.text}
          createdAt={past.createdAt}
          onClose={() => setPast(null)}
        />
      )}

      {preview &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/65 z-[100] flex items-center justify-center p-4 animate-fade-in"
            onMouseDown={close}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={t('admin.announcement.confirmTitle')}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] bg-[var(--bg2)] border border-[var(--border)] rounded-xl px-6 py-5"
            >
              <div className="text-base font-bold">{t('admin.announcement.confirmTitle')}</div>
              <p className="mt-1 mb-4 text-[12px] text-[var(--text3)]">
                {t('admin.announcement.confirmHint')}
              </p>
              <div
                role="menu"
                aria-label={t('notif.title')}
                className="max-w-80 mx-auto bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden"
              >
                <NotificationItem n={preview} onClick={() => setReading(true)} />
              </div>
              {failed && (
                <p role="alert" className="mt-4 mb-0 text-[13px] text-[var(--error)]">
                  {t('admin.announcement.failed')}
                </p>
              )}
              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  onClick={close}
                  className="text-[13px] px-4 py-2 rounded-[var(--radius-sm)] bg-transparent border border-[var(--border)] text-[var(--text2)] font-semibold hover:text-[var(--text)] transition cursor-pointer"
                >
                  {t('admin.announcement.cancel')}
                </button>
                <button
                  onClick={send}
                  disabled={sending}
                  className="text-[13px] px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? t('admin.announcement.sending') : t('admin.announcement.send')}
                </button>
              </div>
              {/* Inside the dialog, so a click on its backdrop stops here and leaves this one open */}
              {reading && (
                <AnnouncementModal
                  text={preview.data?.text ?? ''}
                  createdAt={preview.createdAt}
                  onClose={() => setReading(false)}
                />
              )}
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
