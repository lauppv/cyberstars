import { useCallback, useEffect, useRef, useState } from 'react';

// Thin wrapper over the official YouTube IFrame Player API. Loads the API script
// lazily (only when the radio is first started, so lesson pages pay nothing for
// an unused feature), creates one `YT.Player` targeting a container div, and
// exposes imperative play/pause/volume/load controls plus a coarse state.
//
// We embed through the privacy-enhanced nocookie host and keep the iframe at
// 200×200 (visible, not hidden) to honour the IFrame API terms — see
// FEATURES-PLAN.md §5.2. The player at the app root effectively never unmounts.

type RadioPlayerState = 'idle' | 'buffering' | 'playing' | 'paused' | 'ended' | 'error';

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  setVolume(volume: number): void;
  loadPlaylist(opts: { list: string; listType: string }): void;
  destroy(): void;
}

interface YTPlayerEvent {
  data: number;
  target: YTPlayer;
}

interface YTPlayerOptions {
  host?: string;
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, number | string>;
  events?: {
    onReady?: (e: YTPlayerEvent) => void;
    onStateChange?: (e: YTPlayerEvent) => void;
    onError?: (e: YTPlayerEvent) => void;
  };
}

interface YTNamespace {
  Player: new (el: HTMLElement, opts: YTPlayerOptions) => YTPlayer;
  PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const API_SRC = 'https://www.youtube.com/iframe_api';
let apiPromise: Promise<YTNamespace> | null = null;

// Load the IFrame API exactly once, resolving when `window.YT` is ready. The API
// calls a global `onYouTubeIframeAPIReady`; we chain any previous handler so we
// don't clobber another loader.
function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<YTNamespace>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT as YTNamespace);
    };
    const tag = document.createElement('script');
    tag.src = API_SRC;
    document.head.appendChild(tag);
  });
  return apiPromise;
}

function mapState(yt: YTNamespace, data: number): RadioPlayerState {
  switch (data) {
    case yt.PlayerState.PLAYING:
      return 'playing';
    case yt.PlayerState.PAUSED:
      return 'paused';
    case yt.PlayerState.BUFFERING:
      return 'buffering';
    case yt.PlayerState.ENDED:
      return 'ended';
    default:
      return 'idle';
  }
}

interface YouTubePlayerControls {
  ready: boolean;
  state: RadioPlayerState;
  load: (playlistId: string, volume: number) => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
}

// `containerRef` must point at a mounted div; the player creates its iframe as a
// child of it (a detached node React never touches, so unmount can't conflict).
export function useYouTubePlayer(
  containerRef: React.RefObject<HTMLDivElement | null>,
): YouTubePlayerControls {
  const playerRef = useRef<YTPlayer | null>(null);
  const ytRef = useRef<YTNamespace | null>(null);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<RadioPlayerState>('idle');

  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  const load = useCallback(
    (playlistId: string, volume: number) => {
      if (playerRef.current && ytRef.current) {
        playerRef.current.setVolume(volume);
        playerRef.current.loadPlaylist({ list: playlistId, listType: 'playlist' });
        return;
      }
      loadYouTubeApi().then((yt) => {
        const container = containerRef.current;
        if (!container || playerRef.current) return;
        ytRef.current = yt;
        const host = document.createElement('div');
        container.appendChild(host);
        playerRef.current = new yt.Player(host, {
          host: 'https://www.youtube-nocookie.com',
          width: '200',
          height: '200',
          playerVars: {
            autoplay: 1,
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
            listType: 'playlist',
            list: playlistId,
          },
          events: {
            onReady: (e) => {
              e.target.setVolume(volume);
              setReady(true);
            },
            onStateChange: (e) => setState(mapState(yt, e.data)),
            onError: () => setState('error'),
          },
        });
      });
    },
    [containerRef],
  );

  const play = useCallback(() => playerRef.current?.playVideo(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);
  const setVolume = useCallback((volume: number) => playerRef.current?.setVolume(volume), []);

  return { ready, state, load, play, pause, setVolume };
}
