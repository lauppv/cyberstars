import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRadio } from '../../context/RadioContext';
import { useYouTubePlayer } from '../../hooks/useYouTubePlayer';
import { RADIO_STATIONS } from '../../constants/radioStations';

// Floating focus-radio chip, bottom-right. Mounted once at the app root so
// playback survives route changes. The YouTube iframe stays visible at 200×200
// while playing (IFrame API terms — see FEATURES-PLAN.md §5.2); "collapsed" only
// trims the station picker / volume, it never hides the video.
export function RadioPlayer() {
  const { t } = useTranslation();
  const {
    enabled,
    station,
    stationId,
    volume,
    playing,
    expanded,
    started,
    setStation,
    setVolume,
    togglePlay,
    setExpanded,
  } = useRadio();

  const containerRef = useRef<HTMLDivElement>(null);
  const { state, load, play, pause, setVolume: setPlayerVolume } = useYouTubePlayer(containerRef);
  const loadedVideoRef = useRef<string | null>(null);

  // Drive the underlying player from context state. Loading (re)starts playback
  // at the live edge; play/pause toggle without reloading.
  useEffect(() => {
    if (!enabled || !started) return;
    if (playing) {
      if (loadedVideoRef.current !== station.videoId) {
        loadedVideoRef.current = station.videoId;
        load(station.videoId, volume);
      } else {
        play();
      }
    } else {
      pause();
    }
    // volume is applied by its own effect; excluded to avoid reloads on drag
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, started, playing, station.videoId]);

  useEffect(() => {
    setPlayerVolume(volume);
  }, [volume, setPlayerVolume]);

  if (!enabled) return <LockedRadioChip />;

  const offline = state === 'error' || state === 'ended';

  return (
    <div className="fixed bottom-4 right-4 z-40 flex w-[220px] flex-col items-stretch gap-2">
      {started && (
        <div className="rounded-[var(--radius)] border border-[var(--accent)]/30 bg-[rgba(22,22,29,0.1)] p-2 backdrop-blur-[12px]">
          <div
            ref={containerRef}
            className="mx-auto h-[200px] w-[200px] overflow-hidden rounded-[var(--radius-sm)] bg-black/40"
          />
          {offline && (
            <p className="mt-2 text-center text-[11px] text-[var(--danger,#e06c75)]">
              {t('radio.offline')}
            </p>
          )}
        </div>
      )}

      {expanded && (
        <div className="rounded-[var(--radius)] border border-[var(--accent)]/30 bg-[rgba(22,22,29,0.1)] p-3 backdrop-blur-[12px]">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text3)]">
            {t('radio.stations')}
          </div>
          <div className="flex flex-col gap-1">
            {RADIO_STATIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setStation(s.id)}
                className={`rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-[12px] transition ${
                  s.id === stationId
                    ? 'bg-[var(--accent)]/20 text-[var(--text)]'
                    : 'text-[var(--text2)] hover:bg-[var(--surface)]'
                }`}
              >
                {t(s.titleKey)}
              </button>
            ))}
          </div>
          <div className="mt-3 border-t border-[var(--accent)]/20 pt-3">
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
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-[var(--text3)]">
            {t('radio.adsNote')}
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
        <span
          className="min-w-0 flex-1 truncate text-[12px] text-[var(--text2)]"
          title={t(station.titleKey)}
        >
          {t(station.titleKey)}
        </span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[12px] text-[var(--text3)] transition hover:bg-[var(--surface)]"
          aria-label={expanded ? t('radio.collapse') : t('radio.expand')}
          aria-expanded={expanded}
        >
          {expanded ? '▾' : '▴'}
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
