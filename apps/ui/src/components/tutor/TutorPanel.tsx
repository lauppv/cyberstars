import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp, PanelLeft, SquarePen, Trash2, X } from 'lucide-react';
import { TUTOR_MESSAGE_MAX_LENGTH, type TutorMessage } from '@cyberstars/shared/tutor';
import { useAuth } from '../../context/AuthContext';
import { useTutor, type TutorLessonStage } from '../../context/TutorContext';
import type { TutorStarter } from '../../context/tutorStarters';
import { useUsage } from '../../context/UsageContext';
import { TutorAnswer } from './TutorAnswer';
import { TutorHistory } from './TutorHistory';
import { TutorMark, type TutorMood } from './TutorMark';
import { TutorStatus } from './TutorStatus';

// Close enough to the bottom to count as following the conversation.
const FOLLOW_PX = 80;

// The 90% notice, once closed, stays closed until the window it was about
// ends: this keeps that window's refill time.
const NOTICE_KEY = 'cyberstars.tutorNotice';

function closedNotice(): string | null {
  try {
    return localStorage.getItem(NOTICE_KEY);
  } catch {
    return null;
  }
}

// setTimeout can't wait longer than this.
const MAX_DELAY_MS = 2 ** 31 - 1;

function StudentBubble({ text, muted }: { text: string; muted?: boolean }) {
  return (
    <div
      className={`self-end max-w-[85%] px-3 py-2 rounded-[var(--radius)] bg-[var(--accent)]/15 text-[13px] text-[var(--text)] whitespace-pre-wrap break-words ${
        muted ? 'opacity-60' : ''
      }`}
    >
      {text}
    </div>
  );
}

// Everything the tutor says sits beside its mark, so a glance tells it from the student
function TutorTurn({ children, mood }: { children: ReactNode; mood?: TutorMood }) {
  return (
    <div className="flex items-start gap-2.5">
      <TutorMark size="sm" mood={mood} />
      <div className="flex-1 min-w-0 flex flex-col gap-1 pt-0.5">{children}</div>
    </div>
  );
}

// What the student can ask with one click on an empty lesson chat: it follows
// where they stand, a start, the failed test, or what to take from a passed one
function lessonStarters(stage: TutorLessonStage | null): TutorStarter[] {
  switch (stage?.stage) {
    case 'empty':
      return [
        { key: 'tutor.start.where' },
        { key: 'tutor.start.task' },
        { key: 'tutor.start.nudge' },
      ];
    case 'failing':
      return [
        stage.test
          ? { key: 'tutor.start.failedTest', values: { n: stage.test } }
          : { key: 'tutor.start.broken' },
        { key: 'tutor.start.nudge' },
        { key: 'tutor.start.task' },
      ];
    case 'passed':
      return [
        { key: 'tutor.start.simpler' },
        { key: 'tutor.start.why' },
        { key: 'tutor.start.elsewhere' },
      ];
    default:
      return [
        { key: 'tutor.start.task' },
        { key: 'tutor.start.broken' },
        { key: 'tutor.start.nudge' },
      ];
  }
}

// An empty conversation greets the student by their first name, as fits the hour
function partOfDay(hour: number): 'morning' | 'day' | 'evening' | 'night' {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'day';
  if (hour >= 18 && hour < 23) return 'evening';
  return 'night';
}

// The box grows with what the student writes, up to its max-height
const BOX_MAX_PX = 160;

function Note({ children }: { children: string }) {
  return <p className="text-[12px] text-[var(--text3)]">{children}</p>;
}

function Answer({
  message,
  onInAppLink,
}: {
  message: TutorMessage;
  onInAppLink: (() => void) | null;
}) {
  const { t } = useTranslation();
  if (message.finish === 'blocked' && !message.text) {
    return (
      <TutorTurn>
        <Note>{t('tutor.blocked')}</Note>
      </TutorTurn>
    );
  }
  return (
    <TutorTurn>
      <TutorAnswer text={message.text} onInAppLink={onInAppLink} />
      {message.finish === 'cut' && <Note>{t('tutor.cut')}</Note>}
      {message.finish === 'blocked' && <Note>{t('tutor.blockedMidway')}</Note>}
    </TutorTurn>
  );
}

export function TutorPanel() {
  const { t, i18n } = useTranslation();
  const tutor = useTutor()!;
  const { messages, pending, failure } = tutor;
  const { summary, refresh } = useUsage();
  const firstName = useAuth().user?.name?.trim().split(/\s+/)[0];
  const [draft, setDraft] = useState('');
  const [noticeClosedFor, setNoticeClosedFor] = useState(closedNotice);
  // A delete or an earlier page that failed, kept with the conversation it
  // failed in, so another one doesn't show it.
  const [failed, setFailed] = useState<{
    key: string | null;
    action: 'delete' | 'earlier';
    text: string;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLTextAreaElement>(null);
  const following = useRef(true);
  // Another conversation opens at its newest message.
  const shownBefore = useRef(tutor.conversationKey);
  // Height and position before older messages go in on top, so the view can
  // stay where the student was reading.
  const prepend = useRef<{ height: number; top: number } | null>(null);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (shownBefore.current !== tutor.conversationKey) {
      shownBefore.current = tutor.conversationKey;
      following.current = true;
    }
    if (prepend.current) {
      el.scrollTop = prepend.current.top + (el.scrollHeight - prepend.current.height);
      prepend.current = null;
    } else if (following.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, pending, failure, tutor.cheer, tutor.conversationKey]);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    box.style.height = 'auto';
    const borders = box.offsetHeight - box.clientHeight;
    box.style.height = `${Math.min(box.scrollHeight + borders, BOX_MAX_PX)}px`;
  }, [draft]);

  // The 5-hour session: a notice at 90% used, and the box shut at the limit
  // until the window ends.
  const session = summary?.tutorMessage;
  const refillAt = session && !session.unlimited ? session.resetAt : null;
  const limited = !!refillAt && session!.remaining <= 0;
  const nearly = !!refillAt && !limited && session!.used >= session!.limit * 0.9;
  const refillTime = refillAt
    ? new Date(refillAt).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })
    : '';

  // When the window ends, read the usage again, so the box opens without a reload.
  useEffect(() => {
    if (!refillAt) return;
    const wait = Math.max(0, Date.parse(refillAt) - Date.now()) + 1000;
    const timer = setTimeout(refresh, Math.min(wait, MAX_DELAY_MS));
    return () => clearTimeout(timer);
  }, [refillAt, refresh]);

  function closeNotice() {
    setNoticeClosedFor(refillAt);
    try {
      localStorage.setItem(NOTICE_KEY, refillAt!);
    } catch {
      // Without storage the notice stays closed until the panel remounts.
    }
  }

  const busy = pending !== null;

  function ask(text: string): boolean {
    if (!text.trim() || busy || limited) return false;
    following.current = true;
    setFailed(null);
    tutor.send(text);
    return true;
  }

  function submit() {
    if (ask(draft)) setDraft('');
  }

  function failedIn(key: string | null, action: 'delete' | 'earlier', err: unknown) {
    const text = err instanceof Error && err.message ? err.message : t('common.somethingWrong');
    setFailed({ key, action, text });
  }

  function loadEarlier() {
    const el = scrollRef.current;
    if (el) prepend.current = { height: el.scrollHeight, top: el.scrollTop };
    const key = tutor.conversationKey;
    setFailed(null);
    tutor.loadEarlier().catch((err: unknown) => {
      prepend.current = null;
      failedIn(key, 'earlier', err);
    });
  }

  async function clear() {
    if (!window.confirm(t('tutor.confirmDelete'))) return;
    const key = tutor.conversationKey;
    setFailed(null);
    await tutor.clear().catch((err: unknown) => failedIn(key, 'delete', err));
  }

  const shownFailed = failed?.key === tutor.conversationKey ? failed : null;

  const empty = messages.length === 0 && !pending && !failure;
  // Its title cheers while the lesson's tests have just passed, else greets.
  let emptyTitle = t('tutor.emptyTitle');
  if (tutor.cheer) emptyTitle = t(tutor.cheer);
  else if (firstName) {
    emptyTitle = t(`tutor.greeting.${partOfDay(new Date().getHours())}`, { name: firstName });
  }
  // A lesson chat keeps the student on the lesson: its answers follow no in-app link.
  const onInAppLink = tutor.lesson ? null : tutor.close;

  return (
    <aside
      aria-label={t('tutor.title')}
      onKeyDown={(e) => {
        if (e.key === 'Escape') tutor.close();
      }}
      className="fixed inset-y-0 right-0 z-50 w-full md:w-[400px] flex flex-col bg-[var(--bg2)] border-l border-[var(--border)]"
    >
      {tutor.historyOpen && <TutorHistory />}
      <header className="flex items-center gap-2 h-12 pl-2 pr-4 flex-shrink-0 border-b border-[var(--border)]">
        <button
          type="button"
          onClick={tutor.toggleHistory}
          aria-pressed={tutor.historyOpen}
          title={t(tutor.historyOpen ? 'tutor.hideHistory' : 'tutor.showHistory')}
          aria-label={t('tutor.history')}
          className="p-1.5 rounded-[var(--radius-sm)] bg-transparent border-none text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition cursor-pointer"
        >
          <PanelLeft size={16} strokeWidth={1.75} />
        </button>
        <TutorMark size="md" mood={busy ? 'thinking' : tutor.cheer ? 'happy' : 'idle'} />
        <div className="flex flex-col min-w-0 flex-1 leading-tight">
          <h2 className="text-[13px] font-semibold text-[var(--text)]">{t('tutor.title')}</h2>
          <span className="text-[11px] text-[var(--text3)] truncate">
            {tutor.lesson?.title ?? t('tutor.general')}
          </span>
        </div>
        <button
          type="button"
          onClick={tutor.startNew}
          disabled={empty}
          title={t('tutor.newConversation')}
          aria-label={t('tutor.newConversation')}
          className="p-1.5 rounded-[var(--radius-sm)] bg-transparent border-none text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <SquarePen size={16} strokeWidth={1.75} />
        </button>
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

      {nearly && noticeClosedFor !== refillAt && (
        <div
          role="status"
          className="flex items-start gap-2 mx-4 mt-3 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--glass)] text-[12px] text-[var(--text2)] flex-shrink-0"
        >
          <span className="flex-1">{t('tutor.nearlyUsed', { time: refillTime })}</span>
          <button
            type="button"
            onClick={closeNotice}
            title={t('tutor.closeNotice')}
            aria-label={t('tutor.closeNotice')}
            className="p-0.5 rounded-[var(--radius-sm)] bg-transparent border-none text-[var(--text3)] hover:text-[var(--text)] transition cursor-pointer flex-shrink-0"
          >
            <X size={14} strokeWidth={1.75} />
          </button>
        </div>
      )}

      {shownFailed?.action === 'delete' && (
        <p role="alert" className="mx-4 mt-3 text-[12px] text-[var(--error)] flex-shrink-0">
          {shownFailed.text}
        </p>
      )}

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
        {shownFailed?.action === 'earlier' && (
          <p role="alert" className="self-center text-[12px] text-[var(--error)]">
            {shownFailed.text}
          </p>
        )}
        {tutor.loadFailed && <Note>{t('tutor.loadFailed')}</Note>}
        {empty && !tutor.loading && !tutor.loadFailed && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <TutorMark size="lg" mood={tutor.cheer ? 'happy' : 'idle'} />
            <h3 className="text-[14px] font-semibold text-[var(--text)]">{emptyTitle}</h3>
            <p className="text-[13px] text-[var(--text2)]">
              {t(tutor.lesson ? 'tutor.introLesson' : 'tutor.intro')}
            </p>
            <div className="flex flex-col gap-2 w-full mt-2">
              {(tutor.lesson ? lessonStarters(tutor.stage) : tutor.starters).map((starter) => (
                <button
                  key={starter.key}
                  type="button"
                  onClick={() => ask(t(starter.key, starter.values))}
                  disabled={limited}
                  className="px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent text-left text-[13px] text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t(starter.key, starter.values)}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) =>
          m.role === 'student' ? (
            <StudentBubble key={m.id} text={m.text} />
          ) : (
            <Answer key={m.id} message={m} onInAppLink={onInAppLink} />
          ),
        )}

        {tutor.cheer && !empty && (
          <TutorTurn mood="happy">
            <p className="text-[13px] text-[var(--text)]">{t(tutor.cheer)}</p>
          </TutorTurn>
        )}

        {failure && !failure.afterWords && <StudentBubble text={failure.question} muted />}
        {failure && (
          <div className="flex items-center gap-3">
            <Note>{t(failure.reason)}</Note>
            {!busy && !limited && (
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
            <TutorTurn mood={pending.answer ? 'idle' : 'thinking'}>
              {pending.answer ? (
                <TutorAnswer text={pending.answer} onInAppLink={onInAppLink} />
              ) : (
                <TutorStatus lookup={pending.lookup} lesson={!!tutor.lesson} />
              )}
            </TutorTurn>
          </>
        )}
      </div>

      {limited && (
        <p
          role="status"
          className="px-4 pt-3 text-[12px] text-[var(--text2)] border-t border-[var(--border)] flex-shrink-0"
        >
          {t('tutor.limitReached', { time: refillTime })}
        </p>
      )}
      <form
        className={`p-3 flex-shrink-0 ${limited ? '' : 'border-t border-[var(--border)]'}`}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="relative">
          <textarea
            ref={boxRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            disabled={limited}
            maxLength={TUTOR_MESSAGE_MAX_LENGTH}
            placeholder={t('tutor.placeholder')}
            aria-label={t('tutor.placeholder')}
            className="block w-full resize-none overflow-y-auto pl-3 pr-11 py-2 rounded-[var(--radius)] bg-[var(--glass)] border border-[var(--border)] text-[13px] leading-5 text-[var(--text)] placeholder:text-[var(--text3)] focus:outline-none focus:border-[var(--accent)]/60 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!draft.trim() || busy || limited}
            title={t('tutor.send')}
            aria-label={t('tutor.send')}
            className="absolute right-1.5 bottom-1.5 w-7 h-7 flex items-center justify-center rounded-full bg-[var(--accent)] text-white border-none hover:brightness-110 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowUp size={16} strokeWidth={2} />
          </button>
        </div>
        <p className="mt-1.5 text-[11px] text-[var(--text3)]">{t('tutor.enterHint')}</p>
      </form>
    </aside>
  );
}
