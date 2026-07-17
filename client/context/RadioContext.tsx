import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { canAccessFeature } from '../../shared/features';
import { RADIO_STATIONS, DEFAULT_STATION_ID } from '../constants/radioStations';
import type { RadioStation } from '../constants/radioStations';

const STORAGE_KEY = 'cyberstars.radio';
const DEFAULT_VOLUME = 40;

interface PersistedPrefs {
  stationId: string;
  volume: number;
}

function readPrefs(): PersistedPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedPrefs>;
      const stationId = RADIO_STATIONS.some((s) => s.id === parsed.stationId)
        ? (parsed.stationId as string)
        : DEFAULT_STATION_ID;
      const volume =
        typeof parsed.volume === 'number'
          ? Math.min(100, Math.max(0, parsed.volume))
          : DEFAULT_VOLUME;
      return { stationId, volume };
    }
  } catch {
    // storage blocked or corrupt — fall through to defaults
  }
  return { stationId: DEFAULT_STATION_ID, volume: DEFAULT_VOLUME };
}

interface RadioContextValue {
  enabled: boolean;
  station: RadioStation;
  stationId: string;
  volume: number;
  playing: boolean;
  expanded: boolean;
  started: boolean; // has the user pressed play at least once (gates the lazy iframe)
  setStation: (id: string) => void;
  setVolume: (v: number) => void;
  togglePlay: () => void;
  setExpanded: (v: boolean) => void;
}

const RadioContext = createContext<RadioContextValue | null>(null);

export function RadioProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const enabled = canAccessFeature('radio', user?.role, import.meta.env.PROD);

  const initial = useMemo(() => readPrefs(), []);
  const [stationId, setStationId] = useState(initial.stationId);
  const [volume, setVolumeState] = useState(initial.volume);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [started, setStarted] = useState(false);

  // Persist only the durable prefs; playing/expanded are per-session (autoplay is
  // blocked without a gesture, so we never resume playback automatically).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stationId, volume }));
    } catch {
      // storage blocked; keep in-memory state only
    }
  }, [stationId, volume]);

  const station = useMemo(
    () => RADIO_STATIONS.find((s) => s.id === stationId) ?? RADIO_STATIONS[0],
    [stationId],
  );

  const setStation = useCallback((id: string) => {
    if (!RADIO_STATIONS.some((s) => s.id === id)) return;
    setStationId(id);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(Math.min(100, Math.max(0, v)));
  }, []);

  const togglePlay = useCallback(() => {
    setStarted(true);
    setPlaying((p) => !p);
  }, []);

  const value = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );

  return <RadioContext value={value}>{children}</RadioContext>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRadio(): RadioContextValue {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('useRadio must be used within RadioProvider');
  return ctx;
}
