import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, X } from 'lucide-react';
import { TUTOR_MESSAGE_MAX_LENGTH, type TutorMessage } from '@cyberstars/shared/tutor';
import { useTutor } from '../../context/TutorContext';
import { TutorAnswer } from './TutorAnswer';
import { TutorStatus } from './TutorStatus';

// Close enough to the bottom to count as following the conversation.
const FOLLOW_PX = 80;

function StudentBubble({ text, muted }: { text: string; muted?: boolean }) {
  return (
    <div
      className={`self-end max-w-[85%] px-3 py-2 rounded-[var(--radius)] bg-[var(--glass)] text-[13px] text-[var(--text)] whitespace-pre-wrap break-words ${
        muted ? 'opacity-60' : ''
      }`}
    >
      {text}
    </div>
  );
}

function Note({ children }: { children: string }) {
  return <p className="text-[12px] text-[var(--text3)]">{children}</p>;
}

function Answer({ message, onInAppLink }: { message: TutorMessage; onInAppLink: () => void }) {
  const { t } = useTranslation();
  if (message.finish === 'blocked' && !message.text) return <Note>{t('tutor.blocked')}</Note>;
  return (
    <div className="flex flex-col gap-1">
      <TutorAnswer text={message.text} onInAppLink={onInAppLink} />
      {message.finish === 'cut' && <Note>{t('tutor.cut')}</Note>}
    </div>
  );
}

export function TutorPanel() {
  const { t } = useTranslation();
  const tutor = useTutor()!;
  const { messages, pending, failure } = tutor;
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const following = useRef(true);
  // Height and position before older messages go in on top, so the view can
  // stay where the student was reading.
  const prepend = useRef<{ height: number; top: number } | null>(null);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (prepend.current) {
      el.scrollTop = prepend.current.top + (el.scrollHeight - prepend.current.height);
      prepend.current = null;
    } else if (following.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, pending, failure]);

  const busy = pending !== null;

  function submit() {
    if (!draft.trim() || busy) return;
    following.current = true;
    tutor.send(draft);
    setDraft('');
  }

  function loadEarlier() {
    const el = scrollRef.current;
    if (el) prepend.current = { height: el.scrollHeight, top: el.scrollTop };
    tutor.loadEarlier().catch(() => {
      prepend.current = null;
    });
  }

  async function clear() {
    if (!window.confirm(t('tutor.confirmDelete'))) return;
    await tutor.clear().catch(() => {});
  }

  const empty = messages.length === 0 && !pending && !failure;

  return (
    <aside
      aria-label={t('tutor.title')}
      onKeyDown={(e) => {
        if (e.key === 'Escape') tutor.close();
      }}
      className="fixed inset-y-0 right-0 z-50 w-full md:w-[400px] flex flex-col bg-[var(--bg2)] border-l border-[var(--border)]"
    >
      <header className="flex items-center gap-2 h-12 px-4 flex-shrink-0 border-b border-[var(--border)]">
        <div className="flex flex-col min-w-0 flex-1 leading-tight">
          <h2 className="text-[13px] font-semibold text-[var(--text)]">{t('tutor.title')}</h2>
          <span className="text-[11px] text-[var(--text3)] truncate">{t('tutor.general')}</span>
        </div>
        <button
          type="button"
          onClick={() => void clear()}
          disabled={busy || messages.length === 0}
          title={t('tutor.deleteConversation')}
          aria-label={t('tutor.deleteConversation')}
          className="p-1.5 rounded-[var(--radius-sm)] bg-transparent border-none text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 size={16} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={tutor.close}
          title={t('tutor.close')}
          aria-label={t('tutor.close')}
          className="p-1.5 rounded-[var(--radius-sm)] bg-transparent border-none text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition cursor-pointer"
        >
          <X size={16} strokeWidth={1.75} />
        </button>
      </header>

      <div
        ref={scrollRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          following.current = el.scrollHeight - el.scrollTop - el.clientHeight < FOLLOW_PX;
        }}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-4"
      >
        {tutor.hasMore && (
          <button
            type="button"
            onClick={loadEarlier}
            className="self-center text-[12px] text-[var(--text2)] bg-transparent border-none hover:text-[var(--text)] cursor-pointer"
          >
            {t('tutor.earlier')}
          </button>
        )}
        {tutor.loadFailed && <Note>{t('tutor.loadFailed')}</Note>}
        {empty && !tutor.loading && !tutor.loadFailed && (
          <p className="text-[13px] text-[var(--text2)]">{t('tutor.intro')}</p>
        )}

        {messages.map((m) =>
          m.role === 'student' ? (
            <StudentBubble key={m.id} text={m.text} />
          ) : (
            <Answer key={m.id} message={m} onInAppLink={tutor.close} />
          ),
        )}

        {failure && !failure.afterWords && <StudentBubble text={failure.question} muted />}
        {failure && (
          <div className="flex items-center gap-3">
            <Note>{t(failure.reason)}</Note>
            {!busy && (
              <button
                type="button"
                onClick={tutor.retry}
                className="text-[12px] font-medium text-[var(--accent)] bg-transparent border-none hover:underline cursor-pointer flex-shrink-0"
              >
                {t('tutor.tryAgain')}
              </button>
            )}
          </div>
        )}

        {pending && (
          <>
            <StudentBubble text={pending.question} />
            {pending.answer ? (
              <TutorAnswer text={pending.answer} onInAppLink={tutor.close} />
            ) : (
              <TutorStatus />
            )}
          </>
        )}
      </div>

      <form
        className="flex items-end gap-2 p-3 border-t border-[var(--border)] flex-shrink-0"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={2}
          maxLength={TUTOR_MESSAGE_MAX_LENGTH}
          placeholder={t('tutor.placeholder')}
          aria-label={t('tutor.placeholder')}
          className="flex-1 resize-none max-h-40 min-h-[40px] px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--glass)] border border-[var(--border)] text-[13px] text-[var(--text)] placeholder:text-[var(--text3)] focus:outline-none focus:border-[var(--accent)]/60"
        />
        <button
          type="submit"
          disabled={!draft.trim() || busy}
          className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          {t('tutor.send')}
        </button>
      </form>
    </aside>
  );
}
