import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { DIFF_COLORS, type Difficulty } from '../../constants/difficulty';

export interface SetRowProps {
  to: string;
  number: number;
  title: string;
  done: boolean;
  // The next one to do in a course: its number ringed in the accent
  next?: boolean;
  // A challenge's or a project's difficulty: its number in that colour and a pill
  difficulty?: Difficulty;
  // What the row gives or how far along it is: +20 XP, 3 / 9
  trailing?: ReactNode;
  // Its place in the list, so the rows come in one after another
  order: number;
}

// One row of a set's drawer: the number (a tick once done), the title, what it
// gives, and for a challenge or a project its difficulty
export function SetRow({
  to,
  number,
  title,
  done,
  next,
  difficulty,
  trailing,
  order,
}: SetRowProps) {
  const { t } = useTranslation();
  const dc = difficulty ? DIFF_COLORS[difficulty] : null;
  const markStyle: CSSProperties | undefined =
    !done && !next && dc ? { background: dc.bg, color: dc.text } : undefined;
  return (
    <Link
      to={to}
      className={`set-row relative flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] hover:bg-[var(--surface)] transition text-[var(--text)] no-underline group ${next ? 'ch-is-next' : ''}`}
      style={{ animationDelay: `${0.05 + Math.min(order, 20) * 0.04}s` }}
    >
      <span
        className={`relative z-[1] w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 border-2 border-[var(--bg2)] transition-all ${
          done
            ? 'bg-[var(--success)] text-white set-row-done'
            : next
              ? 'bg-[var(--bg2)] text-[var(--accent)] border-[var(--accent)] ch-next-pulse'
              : dc
                ? ''
                : 'bg-[var(--bg3)] text-[var(--text3)]'
        }`}
        style={markStyle}
      >
        {done ? '✓' : number}
      </span>
      <span
        className={`flex-1 min-w-0 text-[13px] font-medium leading-tight transition group-hover:text-[var(--accent)] ${next ? 'text-[var(--accent)]' : ''}`}
      >
        {title}
      </span>
      {trailing && (
        <span
          className={`text-[10px] font-semibold tabular-nums flex-shrink-0 ${done ? 'text-[var(--success)]' : 'text-[var(--text3)]'}`}
        >
          {trailing}
        </span>
      )}
      {difficulty && dc && (
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: dc.bg, color: dc.text }}
        >
          {t(`algoList.diff.${difficulty}`)}
        </span>
      )}
    </Link>
  );
}
