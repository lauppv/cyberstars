import { useTranslation } from 'react-i18next';
import { SquarePen, X } from 'lucide-react';
import type { TutorConversationSummary, TutorLessonRef } from '@cyberstars/shared/tutor';
import { useTutor } from '../../context/TutorContext';
import { useCurriculum } from '../../context/CurriculumContext';

const PHONE = '(max-width: 767px)';

type Day = 'today' | 'yesterday' | 'earlier';

function dayOf(iso: string, now: Date): Day {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const at = Date.parse(iso);
  if (at >= startOfToday) return 'today';
  if (at >= startOfToday - 86_400_000) return 'yesterday';
  return 'earlier';
}

// The student's conversations, newest first, grouped by day. From 768px it is a
// column to the left of the panel, over the page; on a phone it covers the
// panel and closes once a conversation is picked.
export function TutorHistory() {
  const { t } = useTranslation();
  const tutor = useTutor()!;
  const { courses } = useCurriculum();

  function lessonTitle(lesson: TutorLessonRef): string {
    const course = courses.find((c) => c.key === lesson.courseKey);
    return course?.lessons.find((l) => l.slug === lesson.lessonSlug)?.title ?? lesson.lessonSlug;
  }

  function pick(summary: TutorConversationSummary) {
    tutor.openConversation(summary, summary.lesson ? lessonTitle(summary.lesson) : '');
    if (window.matchMedia(PHONE).matches) tutor.toggleHistory();
  }

  const now = new Date();
  const groups = new Map<Day, TutorConversationSummary[]>();
  for (const summary of tutor.history ?? []) {
    const day = dayOf(summary.updatedAt, now);
    groups.set(day, [...(groups.get(day) ?? []), summary]);
  }

  return (
    <nav
      aria-label={t('tutor.history')}
      className="absolute inset-0 z-10 flex flex-col bg-[var(--bg2)] md:inset-auto md:top-0 md:bottom-0 md:right-full md:w-[240px] md:border-l md:border-[var(--border)]"
    >
      <div className="flex items-center gap-2 h-12 px-3 flex-shrink-0 border-b border-[var(--border)]">
        <h2 className="flex-1 text-[13px] font-semibold text-[var(--text)]">
          {t('tutor.history')}
        </h2>
        <button
          type="button"
          onClick={tutor.toggleHistory}
          title={t('tutor.hideHistory')}
          aria-label={t('tutor.hideHistory')}
          className="p-1.5 rounded-[var(--radius-sm)] bg-transparent border-none text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition cursor-pointer"
        >
          <X size={16} strokeWidth={1.75} />
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-2 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => {
            tutor.startNew();
            if (window.matchMedia(PHONE).matches) tutor.toggleHistory();
          }}
          className="flex items-center gap-2 px-2.5 py-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent text-left text-[13px] text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)] transition cursor-pointer"
        >
          <SquarePen size={14} strokeWidth={1.75} />
          {t('tutor.newConversation')}
        </button>
        {tutor.historyFailed && (
          <p className="px-2 text-[12px] text-[var(--text3)]">{t('tutor.historyFailed')}</p>
        )}
        {tutor.history?.length === 0 && (
          <p className="px-2 text-[12px] text-[var(--text3)]">{t('tutor.historyEmpty')}</p>
        )}
        {[...groups].map(([day, list]) => (
          <section key={day} className="flex flex-col gap-0.5">
            <h3 className="px-2 pb-1 text-[11px] font-medium text-[var(--text3)]">
              {t(`tutor.day.${day}`)}
            </h3>
            {list.map((summary) => {
              const current = summary.id === tutor.conversationId;
              return (
                <button
                  key={summary.id}
                  type="button"
                  onClick={() => pick(summary)}
                  aria-current={current ? 'true' : undefined}
                  className={`flex flex-col px-2 py-1.5 rounded-[var(--radius-sm)] border-none text-left transition cursor-pointer ${
                    current
                      ? 'bg-[var(--surface2)] text-[var(--text)]'
                      : 'bg-transparent text-[var(--text2)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
                  }`}
                >
                  <span className="text-[13px] truncate">{summary.title}</span>
                  <span className="text-[11px] text-[var(--text3)] truncate">
                    {summary.lesson ? lessonTitle(summary.lesson) : t('tutor.general')}
                  </span>
                </button>
              );
            })}
          </section>
        ))}
      </div>
    </nav>
  );
}
