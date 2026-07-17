// Single source of truth for the Focus Radio stations. Client-only: each entry
// points at a public YouTube livestream that we embed through the official
// IFrame Player API (nocookie host). Titles are i18n keys so the picker is
// bilingual; the visible label comes from `radio.station.<id>`.
//
// IMPORTANT: every `videoId` must be a stream that permits embedding. Livestream
// ids occasionally change when a channel restarts a broadcast, and some streams
// block embedding entirely (IFrame error 101/150). The set below are popular,
// long-running 24/7 lo-fi/synthwave/ambient broadcasts chosen as candidates —
// they still need a manual embed check in the player before we trust them.

type RadioMood = 'focus' | 'chill' | 'space';

export interface RadioStation {
  id: string; // stable key, also used for the i18n title key: radio.station.<id>
  titleKey: string; // i18n: radio.station.<id>
  videoId: string; // YouTube livestream / long video id (must be embeddable)
  mood: RadioMood;
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'lofi',
    titleKey: 'radio.station.lofi',
    videoId: 'jfKfPfyJRdk', // Lofi Girl — "lofi hip hop radio 📚 beats to relax/study to"
    mood: 'focus',
  },
  {
    id: 'synthwave',
    titleKey: 'radio.station.synthwave',
    videoId: '4xDzrJKXOOY', // Lofi Girl — "synthwave radio 🌌 beats to chill/game to"
    mood: 'chill',
  },
  {
    id: 'chillhop',
    titleKey: 'radio.station.chillhop',
    videoId: '7NOSDKb0HlU', // Chillhop Music — "lofi hip hop radio"
    mood: 'chill',
  },
  {
    id: 'ambient',
    titleKey: 'radio.station.ambient',
    videoId: 'S_MOd40zlYU', // "Deep Space Ambient" — space/drone focus
    mood: 'space',
  },
];

export const DEFAULT_STATION_ID = RADIO_STATIONS[0].id;
