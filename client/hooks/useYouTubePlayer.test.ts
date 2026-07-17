import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useYouTubePlayer } from './useYouTubePlayer';

interface FakePlayer {
  opts: Record<string, unknown>;
  played: boolean;
  paused: boolean;
  volume: number;
  loaded: string[];
  destroyed: boolean;
}

const players: FakePlayer[] = [];

function installFakeYT() {
  const PlayerState = { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 };
  class Player {
    played = false;
    paused = false;
    volume = 0;
    loaded: string[] = [];
    destroyed = false;
    opts: Record<string, unknown>;
    constructor(_el: HTMLElement, opts: Record<string, unknown>) {
      this.opts = opts;
      players.push(this as unknown as FakePlayer);
      const events = opts.events as { onReady?: (e: { target: Player }) => void };
      events.onReady?.({ target: this });
    }
    playVideo() {
      this.played = true;
    }
    pauseVideo() {
      this.paused = true;
    }
    setVolume(v: number) {
      this.volume = v;
    }
    loadVideoById(id: string) {
      this.loaded.push(id);
    }
    destroy() {
      this.destroyed = true;
    }
  }
  (window as unknown as { YT: unknown }).YT = { Player, PlayerState };
}

function makeRef() {
  const div = document.createElement('div');
  return { current: div };
}

beforeEach(() => {
  players.length = 0;
  delete (window as unknown as { YT?: unknown }).YT;
  installFakeYT();
});

describe('useYouTubePlayer', () => {
  it('creates a player and applies volume on first load', async () => {
    const ref = makeRef();
    const { result } = renderHook(() => useYouTubePlayer(ref));
    await act(async () => {
      result.current.load('vid1', 40);
    });
    expect(players).toHaveLength(1);
    expect(players[0].opts.videoId).toBe('vid1');
    expect(players[0].volume).toBe(40);
    expect(result.current.ready).toBe(true);
  });

  it('reuses the player and loads a new video on subsequent load', async () => {
    const ref = makeRef();
    const { result } = renderHook(() => useYouTubePlayer(ref));
    await act(async () => {
      result.current.load('vid1', 40);
    });
    await act(async () => {
      result.current.load('vid2', 60);
    });
    expect(players).toHaveLength(1);
    expect(players[0].loaded).toEqual(['vid2']);
    expect(players[0].volume).toBe(60);
  });

  it('delegates play/pause/setVolume to the player', async () => {
    const ref = makeRef();
    const { result } = renderHook(() => useYouTubePlayer(ref));
    await act(async () => {
      result.current.load('vid1', 40);
    });
    act(() => {
      result.current.play();
      result.current.pause();
      result.current.setVolume(80);
    });
    expect(players[0].played).toBe(true);
    expect(players[0].paused).toBe(true);
    expect(players[0].volume).toBe(80);
  });

  it('surfaces player errors via state', async () => {
    const ref = makeRef();
    const { result } = renderHook(() => useYouTubePlayer(ref));
    await act(async () => {
      result.current.load('vid1', 40);
    });
    act(() => {
      const events = players[0].opts.events as { onError: (e: { data: number }) => void };
      events.onError({ data: 150 });
    });
    expect(result.current.state).toBe('error');
  });

  it('maps state changes to coarse player states', async () => {
    const ref = makeRef();
    const { result } = renderHook(() => useYouTubePlayer(ref));
    await act(async () => {
      result.current.load('vid1', 40);
    });
    act(() => {
      const events = players[0].opts.events as { onStateChange: (e: { data: number }) => void };
      events.onStateChange({ data: 1 }); // PLAYING
    });
    expect(result.current.state).toBe('playing');
  });

  it('destroys the player on unmount', async () => {
    const ref = makeRef();
    const { result, unmount } = renderHook(() => useYouTubePlayer(ref));
    await act(async () => {
      result.current.load('vid1', 40);
    });
    unmount();
    expect(players[0].destroyed).toBe(true);
  });
});
