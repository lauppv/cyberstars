import type { ReactNode } from 'react';
import { DIFF_COLORS, type Difficulty } from '../../constants/difficulty';

// The top of a lesson, a challenge or a project, on one line: its title, then
// where it stands in its set (Lesson 1 of 60) and what it gives (+10 XP), with
// Beta, Completed and the difficulty when they apply. On a narrow column the
// facts wrap under the title
export function LessonHeading({
  title,
  position,
  badge,
  completed,
  difficulty,
  difficultyLabel,
  xp,
  done,
}: {
  title: string;
  position: string;
  badge?: ReactNode;
  completed?: string | null;
  difficulty?: Difficulty | null;
  difficultyLabel?: string;
  xp?: string | null;
  done?: boolean;
}) {
  const dc = difficulty ? DIFF_COLORS[difficulty] : null;
  return (
    <div className="flex items-center gap-x-2 gap-y-2 flex-wrap mb-6">
      <h1 className="m-0 mr-1.5 text-[22px] font-bold tracking-[-0.4px] leading-tight text-[var(--text)]">
        {title}
      </h1>
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--accent)]/15 text-[var(--accent)] whitespace-nowrap">
        {position}
      </span>
      {xp && (
        <span
          className={`text-[11px] font-semibold tabular-nums whitespace-nowrap ${done ? 'text-[var(--success)]' : 'text-[var(--accent)]'}`}
        >
          {xp}
        </span>
      )}
      {badge}
      {completed && (
        <span className="text-[var(--success)] text-[11px] font-semibold whitespace-nowrap">
          {completed}
        </span>
      )}
      {dc && difficultyLabel && (
        <span
          className="px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
          style={{ background: dc.bg, color: dc.text }}
        >
          {difficultyLabel}
        </span>
      )}
    </div>
  );
}
