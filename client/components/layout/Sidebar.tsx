import { useNavigate } from "react-router-dom";
import { Badge } from "../gamification/Badge";
import type { LessonMeta } from "../../../shared/lesson";
import type { BadgeDef } from "../../hooks/useGamification";

interface SidebarProps {
  courseTitle: string;
  courseKey: string;
  lessons: LessonMeta[];
  currentSlug: string;
  completedSlugs: Set<string>;
  badges: BadgeDef[];
}

export function Sidebar({
  courseTitle,
  courseKey,
  lessons,
  currentSlug,
  completedSlugs,
  badges,
}: SidebarProps) {
  const navigate = useNavigate();
  const completedCount = lessons.filter((l) => completedSlugs.has(l.slug)).length;
  const totalCount = lessons.length;
  const pct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <aside className="w-[260px] flex-shrink-0 bg-[var(--bg2)] border-r border-[var(--border)] flex flex-col overflow-hidden">
      <div className="px-4 pt-4 pb-3 text-[11px] uppercase tracking-[1px] text-[var(--text3)] font-semibold">
        {courseTitle}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        {lessons.map((lesson, idx) => {
          const completed = completedSlugs.has(lesson.slug);
          const active = lesson.slug === currentSlug;
          return (
            <button
              key={lesson.slug}
              onClick={() => navigate(`/lesson/${courseKey}/${lesson.slug}`)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-left transition cursor-pointer ${
                active
                  ? "bg-[var(--accent)] text-white"
                  : completed
                  ? "text-[var(--text)] hover:bg-[var(--surface)]"
                  : "text-[var(--text2)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${
                  active
                    ? "bg-white/20 text-white"
                    : completed
                    ? "bg-[var(--success)] text-black"
                    : "bg-[var(--bg3)] text-[var(--text3)]"
                }`}
              >
                {completed ? "✓" : idx + 1}
              </span>
              <span className="text-[13px] font-medium leading-tight">
                {lesson.title}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mx-4 my-3 pt-3 border-t border-[var(--border)]">
        <div className="text-[11px] text-[var(--text3)] mb-1.5">
          {completedCount} / {totalCount} completed
        </div>
        <div className="h-1.5 bg-[var(--bg3)] rounded-[3px] overflow-hidden">
          <div
            className="h-full bg-[var(--success)] rounded-[3px] transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="px-4 py-3 border-t border-[var(--border)]">
        <div className="text-[11px] uppercase tracking-[1px] text-[var(--text3)] font-semibold mb-2.5">
          Badges
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {badges.map((b) => (
            <Badge key={b.label} icon={b.icon} label={b.label} earned={b.earned} />
          ))}
        </div>
      </div>
    </aside>
  );
}
