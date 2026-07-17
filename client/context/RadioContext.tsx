import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { canAccessFeature } from '../../shared/features';
import { RADIO_TRACK } from '../constants/radioTrack';
import type { RadioTrack } from '../constants/radioTrack';

const STORAGE_KEY = 'cyberstars.radio';
const DEFAULT_VOLUME = 40;
const MAX_DRIFT_SEC = 2; // resync only when we've slipped more than this
const DRIFT_CHECK_MS = 5000;

function readVolume(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { volume?: unknown };
      if (typeof parsed.volume === 'number') {
        return Math.min(100, Math.max(0, parsed.volume));
      }
    }
  } catch {
    // storage blocked or corrupt — fall through to default
  }
  return DEFAULT_VOLUME;
}

interface RadioContextValue {
  enabled: boolean;
  track: RadioTrack;
  volume: number;
  playing: boolean;
  buffering: boolean; // between pressing play and sound actually starting, or a mid-stream stall
  offline: boolean; // the stream failed to load; pressing play retries
  hidden: boolean; // player minimised to a launcher chip; audio keeps playing
  expanded: boolean;
  setVolume: (v: number) => void;
  togglePlay: () => void;
  setHidden: (v: boolean) => void;
  setExpanded: (v: boolean) => void;
}

const RadioContext = createContext<RadioContextValue | null>(null);

export function RadioProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const enabled = canAccessFeature('radio', user?.role, import.meta.env.PROD);

  const [volume, setVolumeState] = useState(() => readVolume());
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [offline, setOffline] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const offsetRef = useRef(0); // serverNow - clientNow, in ms
  const pendingPlayRef = useRef(false);

  // Fetch the authoritative server clock once, correcting for round-trip so the
  // "live" position is the same second for everyone regardless of local skew.
  useEffect(() => {
    let cancelled = false;
    const t0 = Date.now();
    fetch('/api/time')
      .then((r) => r.json() as Promise<{ now: number }>)
      .then((d) => {
        if (cancelled || typeof d.now !== 'number') return;
        const rtt = Date.now() - t0;
        offsetRef.current = d.now + rtt / 2 - Date.now();
      })
      .catch(() => {
        // server unreachable — fall back to the local clock (offset 0)
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const livePosition = useCallback((durationSec: number) => {
    return ((Date.now() + offsetRef.current) / 1000) % durationSec;
  }, []);

  const seekLive = useCallback(() => {
    const a = audioRef.current;
    const d = a?.duration;
    if (!a || !d || !Number.isFinite(d)) return false;
    a.currentTime = livePosition(d);
    return true;
  }, [livePosition]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(Math.min(100, Math.max(0, v)));
  }, []);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      return;
    }
    // After a load error, play is a retry: reload the source and try again.
    if (offline) {
      setOffline(false);
      a.load();
    }
    setBuffering(true);
    // Resuming re-joins the live position (you can't rewind a broadcast).
    if (!seekLive()) pendingPlayRef.current = true;
    a.play().catch(() => {
      // autoplay/gesture rejection — leave state as paused
      setBuffering(false);
    });
  }, [playing, offline, seekLive]);

  // Apply volume to the element.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // Persist volume only (playback is per-session; a broadcast never auto-resumes).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume }));
    } catch {
      // storage blocked; keep in-memory state only
    }
  }, [volume]);

  // Drift correction: while playing, snap back to the live position if we've
  // slipped too far (accounting for the loop wrap).
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const a = audioRef.current;
      const d = a?.duration;
      if (!a || a.paused || a.seeking || !d || !Number.isFinite(d)) return;
      const expected = livePosition(d);
      let drift = (((expected - a.currentTime) % d) + d) % d; // 0..d
      if (drift > d / 2) drift -= d; // shortest signed distance across the wrap
      if (Math.abs(drift) > MAX_DRIFT_SEC) a.currentTime = expected;
    }, DRIFT_CHECK_MS);
    return () => window.clearInterval(id);
  }, [playing, livePosition]);

  const onLoadedMetadata = useCallback(() => {
    if (pendingPlayRef.current) {
      pendingPlayRef.current = false;
      seekLive();
    }
  }, [seekLive]);

  const value = useMemo(
    () => ({
      enabled,
      track: RADIO_TRACK,
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
    }),
    [enabled, volume, playing, buffering, offline, hidden, expanded, setVolume, togglePlay],
  );

  return (
    <RadioContext value={value}>
      {enabled && (
        // preload="none": nothing downloads until the first play — most visitors
        // never press it, and the file is large. togglePlay's pendingPlayRef path
        // already handles the duration arriving late.
        <audio
          ref={audioRef}
          src={RADIO_TRACK.src}
          loop
          preload="none"
          onLoadedMetadata={onLoadedMetadata}
          onPlay={() => setPlaying(true)}
          onPlaying={() => setBuffering(false)}
          onWaiting={() => setBuffering(true)}
          onPause={() => {
            setPlaying(false);
            setBuffering(false);
          }}
          onError={() => {
            // Missing/unreachable file would otherwise fail silently — surface it.
            setOffline(true);
            setBuffering(false);
            setPlaying(false);
          }}
        />
      )}
      {children}
    </RadioContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRadio(): RadioContextValue {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('useRadio must be used within RadioProvider');
  return ctx;
}
