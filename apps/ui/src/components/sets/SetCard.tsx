import type { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { courseMeta, courseWash } from '../../constants/courses';
import { BetaBadge } from '../ui/BetaBadge';
import { CourseMark } from '../ui/CourseMark';
import { ProgressBar } from './ProgressBar';

export interface SetCardProps {
  // The course or language the card stands for: its colour, mark and wash
  setKey: string;
  title: string;
  // A line under the title, such as the languages a course is taught in
  subtitle?: string | null;
  beta?: boolean;
  betaHint?: string;
  // The pill on the right: the XP the set gives, or Coming soon
  badge?: string;
  badgeMuted?: boolean;
  description: string;
  // How much the set holds, the number in bold: 12 lessons, 40 challenges (or
  // a whole line, for a set whose words aren't counted in every language yet)
  count?: { n: number; noun: string } | string;
  // Given once the student has started the set: the bar and Continue
  progress?: { pct: number; label: string };
  onContinue?: () => void;
  // Opens the set's drawer; without it the card is only shown, not opened
  onOpen?: () => void;
  openLabel: string;
  dimmed?: boolean;
}

// One card for every set a student picks from: a course, a challenge set, a
// language's projects. A started set offers Continue, any other one opens
export function SetCard({
  setKey,
  title,
  subtitle,
  beta,
  betaHint,
  badge,
  badgeMuted,
  description,
  count,
  progress,
  onContinue,
  onOpen,
  openLabel,
  dimmed,
}: SetCardProps) {
  const { t } = useTranslation();
  const { color } = courseMeta(setKey);
  return (
    <div
      onClick={onOpen}
      aria-disabled={onOpen ? undefined : 'true'}
      title={onOpen ? undefined : t('common.comingSoonHint')}
      className={`panel rounded-[var(--radius-lg)] overflow-hidden flex flex-col ${
        onOpen
          ? 'group cursor-pointer transition-all hover:border-[var(--course)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_#0004]'
          : 'cursor-default'
      } ${dimmed ? 'opacity-70' : ''}`}
      style={{ '--course': color, backgroundImage: courseWash(setKey) } as CSSProperties}
    >
      <div className="h-1.5 w-full" style={{ background: color }} />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-3.5 mb-3.5">
          <CourseMark courseKey={setKey} />
          <div className="flex-1 min-w-0">
            <h2 className="m-0 text-base font-bold mb-0.5 flex items-center gap-2 tracking-[-0.2px]">
              {onOpen ? (
                // The drawer from the keyboard too, where the card's own button is Continue
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen();
                  }}
                  className="truncate p-0 bg-transparent border-0 text-inherit [font:inherit] text-left cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-[var(--course)]"
                >
                  {title}
                </button>
              ) : (
                <span className="truncate">{title}</span>
              )}
              {beta && <BetaBadge hint={betaHint} />}
            </h2>
            {subtitle && <div className="text-[12px] text-[var(--text3)]">{subtitle}</div>}
          </div>
          {badge && (
            <span
              className={`flex-shrink-0 self-start text-[12px] font-semibold px-2.5 py-0.5 rounded-full border border-[var(--border)] ${
                badgeMuted ? 'text-[var(--text2)]' : 'bg-[var(--accent)]/10 text-[var(--accent)]'
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="m-0 text-[13px] text-[var(--text2)] leading-relaxed">{description}</p>
        {count && (
          <div className="mt-4 text-[11px] text-[var(--text3)]">
            {typeof count === 'string' ? (
              count
            ) : (
              <>
                <strong className="text-[var(--text2)]">{count.n}</strong> {count.noun}
              </>
            )}
          </div>
        )}
        {onOpen && (
          <div className="mt-auto pt-4 flex items-center justify-between">
            {progress && (
              <ProgressBar
                pct={progress.pct}
                color={color}
                label={progress.label}
                className="flex-1 mr-3"
              />
            )}
            {progress && onContinue ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onContinue();
                }}
                className="btn btn-primary btn-sm flex-shrink-0"
              >
                {t('courses.continue')}
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
                className="btn btn-secondary btn-sm"
              >
                {openLabel}
                <ArrowRight
                  size={13}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
