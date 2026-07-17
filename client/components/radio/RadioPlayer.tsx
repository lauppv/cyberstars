import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRadio } from '../../context/RadioContext';

// Floating focus-radio chip, bottom-right. Mounted once at the app root; the
// actual <audio> element lives in RadioProvider so playback survives navigation
// and minimising. This component is pure UI — play/pause, volume, hide.
export function RadioPlayer() {
  const { t } = useTranslation();
  const {
    enabled,
    track,
    volume,
    playing,
    hidden,
    expanded,
    setVolume,
    togglePlay,
    setHidden,
    setExpanded,
  } = useRadio();

  if (!enabled) return <LockedRadioChip />;

  const title = t(track.titleKey);

  if (hidden) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setHidden(false)}
          className="flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[rgba(22,22,29,0.1)] px-3 py-1.5 backdrop-blur-[12px] transition hover:bg-[var(--surface)]"
          aria-label={t('radio.show')}
          title={title}
        >
          <span>📻</span>
          {playing && (
            <span className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-[var(--accent)]" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex w-[240px] flex-col items-stretch gap-2">
      {expanded && (
        <div className="rounded-[var(--radius)] border border-[var(--accent)]/30 bg-[rgba(22,22,29,0.1)] p-3 backdrop-blur-[12px]">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-[var(--text3)]">
            {t('radio.volume')}
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
            aria-label={t('radio.volume')}
          />
          <p className="mt-3 text-[10px] leading-relaxed text-[var(--text3)]">
            {t('radio.liveNote')}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[rgba(22,22,29,0.1)] px-2 py-1.5 backdrop-blur-[12px]">
        <button
          onClick={togglePlay}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[13px] text-[var(--text)] transition hover:bg-[var(--accent)]/30"
          aria-label={playing ? t('radio.pause') : t('radio.play')}
        >
          {playing ? '⏸' : '▶'}
        </button>
        {playing && (
          <span className="flex flex-shrink-0 items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-[var(--accent)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
            {t('radio.live')}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate text-[12px] text-[var(--text2)]" title={title}>
          {title}
        </span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[12px] text-[var(--text3)] transition hover:bg-[var(--surface)]"
          aria-label={expanded ? t('radio.collapse') : t('radio.expand')}
          aria-expanded={expanded}
        >
          {expanded ? '▾' : '▴'}
        </button>
        <button
          onClick={() => setHidden(true)}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[13px] text-[var(--text3)] transition hover:bg-[var(--surface)]"
          aria-label={t('radio.hide')}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Non-admins on prod (feature still in preview) see the chip locked, matching the
// Topbar preview icons: a tooltip on hover and a "coming soon" hint on click.
function LockedRadioChip() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="fixed bottom-4 right-4 z-40" ref={ref}>
      {open && (
        <div
          role="dialog"
          className="absolute bottom-full right-0 mb-2 w-60 overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg2)] p-3 shadow-[0_8px_32px_#0008]"
        >
          <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-[var(--text)]">
            <span>📻</span>
            <span className="truncate">{t('radio.title')}</span>
            <span className="ml-auto rounded bg-[var(--accent)]/15 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--accent)]">
              {t('common.comingSoon')}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-[var(--text3)]">
            {t('common.comingSoonHint')}
          </p>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[rgba(22,22,29,0.1)] px-3 py-1.5 text-[13px] opacity-60 backdrop-blur-[12px] transition hover:opacity-80"
        title={`${t('radio.title')} · ${t('common.comingSoon')}`}
        aria-label={`${t('radio.title')} · ${t('common.comingSoon')}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>📻</span>
        <span className="text-[12px] text-[var(--text2)]">{t('radio.title')}</span>
        <span className="text-[11px]">🔒</span>
      </button>
    </div>
  );
}
