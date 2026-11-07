import { useEffect, useId, useLayoutEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { courseMeta, courseWash } from '../../constants/courses';
import { BetaBadge } from '../ui/BetaBadge';
import { CourseMark } from '../ui/CourseMark';
import { ProgressBar } from './ProgressBar';

export interface SetDrawerProps {
  setKey: string;
  title: string;
  beta?: boolean;
  betaHint?: string;
  // The short facts under the title; an accent one is the XP
  meta: { text: string; accent?: boolean }[];
  description: string;
  // How far along the student is, over the list
  progress?: { pct: number; label: string };
  // What sits over the list, such as the difficulty filters
  toolbar?: ReactNode;
  label: string;
  onClose: () => void;
  children: ReactNode;
}

// The set's contents in a drawer on the right, over the cards it was opened
// from: a course's chapters, a language's challenges or projects. Escape, the
// X or a click beside it closes it
export function SetDrawer({
  setKey,
  title,
  beta,
  betaHint,
  meta,
  description,
  progress,
  toolbar,
  label,
  onClose,
  children,
}: SetDrawerProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  // The latest onClose, so a page that rebuilds it on each render doesn't
  // send the focus back to the panel from the row the student had reached
  const onCloseRef = useRef(onClose);
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // Once per set: opening another one moves the focus to it
  }, [setKey]);

  return (
    <>
      <div className="fixed inset-0 overlay z-[100]" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="fixed right-0 top-0 bottom-0 w-[440px] max-w-full bg-[var(--bg2)] border-l border-[var(--border)] overflow-y-auto z-[101] outline-none animate-drawer-in"
      >
        <div
          className="flex items-start gap-3.5 p-6 pb-5 border-b border-[var(--border)]"
          style={{ backgroundImage: courseWash(setKey) }}
        >
          <CourseMark courseKey={setKey} size={40} />
          <div className="flex-1 min-w-0">
            <h2 id={titleId} className="m-0 text-xl font-bold mb-1 flex items-center gap-2">
              {title}
              {beta && <BetaBadge hint={betaHint} />}
            </h2>
            <div className="flex gap-3 text-xs text-[var(--text3)]">
              {meta.map((m) => (
                <span key={m.text} className={m.accent ? 'text-[var(--accent)]' : undefined}>
                  {m.text}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            className="w-8 h-8 rounded-full border border-[var(--border)] bg-transparent text-[var(--text3)] flex items-center justify-center cursor-pointer hover:text-[var(--text)] hover:border-[var(--text3)] transition flex-shrink-0"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="px-6 py-5 text-[13px] text-[var(--text2)] leading-relaxed border-b border-[var(--border)]">
          {description}
          {progress && (
            <ProgressBar
              pct={progress.pct}
              color={courseMeta(setKey).color}
              label={progress.label}
              className="mt-4"
            />
          )}
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <h3 className="m-0 section-label">{label}</h3>
            {toolbar}
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
