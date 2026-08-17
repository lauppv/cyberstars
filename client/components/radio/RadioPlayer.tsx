import { useTranslation } from 'react-i18next';
import { useRadio } from '../../context/RadioContext';
import { Deco } from '../ui/Deco';

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
    buffering,
    offline,
    hidden,
    expanded,
    setVolume,
    togglePlay,
    setHidden,
    setExpanded,
  } = useRadio();

  if (!enabled) return null;

  const title = t(track.titleKey);

  if (hidden) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setHidden(false)}
          className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel-bg)] px-3 py-1.5 transition hover:bg-[var(--surface)]"
          aria-label={t('radio.show')}
          title={title}
        >
          <Deco>📻</Deco>
          <Deco only="min" className="text-[12px] font-semibold text-[var(--text2)]">
            {t('radio.title')}
          </Deco>
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
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--panel-bg)] p-3">
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

      <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel-bg)] px-2 py-1.5">
        <button
          onClick={togglePlay}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[13px] text-[var(--text)] transition hover:bg-[var(--accent)]/30"
          aria-label={playing ? t('radio.pause') : t('radio.play')}
        >
          {buffering ? (
            <span
              role="status"
              aria-label={t('radio.loading')}
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]"
            />
          ) : playing ? (
            '⏸'
          ) : (
            '▶'
          )}
        </button>
        {offline ? (
          <span className="flex-shrink-0 text-[9px] font-semibold uppercase tracking-wider text-[var(--error)]">
            {t('radio.offline')}
          </span>
        ) : (
          playing &&
          !buffering && (
            <span className="flex flex-shrink-0 items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-[var(--accent)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
              {t('radio.live')}
            </span>
          )
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
