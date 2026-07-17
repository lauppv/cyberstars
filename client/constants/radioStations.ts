// Single source of truth for the Focus Radio stations. Client-only: each entry
// points at a public YouTube *playlist* that we embed through the official IFrame
// Player API (nocookie host). Titles are i18n keys so the picker is bilingual;
// the visible label comes from `radio.station.<id>`.
//
// Why playlists instead of a single livestream video id: livestreams end, get
// taken down, or change id, so a hardcoded live id rots quickly. A playlist is
// resilient — if one track goes private/unavailable the player just advances to
// the next, and a 50-track list doesn't vanish all at once.
//
// IMPORTANT: playlist ids still need a manual embed check (a whole playlist can
// be set private, or block embedding). To grab one: open a playlist on YouTube
// and copy the `list=` query param (starts with `PL...`). The ids below are
// candidates — validate them in the player and swap any that fail.

type RadioMood = 'focus' | 'chill' | 'space';

export interface RadioStation {
  id: string; // stable key, also used for the i18n title key: radio.station.<id>
  titleKey: string; // i18n: radio.station.<id>
  playlistId: string; // YouTube playlist id (starts with PL...), must be embeddable
  mood: RadioMood;
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'lofi',
    titleKey: 'radio.station.lofi',
    playlistId: 'PLOzDu-MXXLliO9fBNZOQTBDddoA3FzZUo', // lo-fi hip hop mix — VALIDATE
    mood: 'focus',
  },
  {
    id: 'synthwave',
    titleKey: 'radio.station.synthwave',
    playlistId: 'PLtP2vRJt40kAT7glcvv8odPJHTBUxHfjB', // synthwave / retrowave — VALIDATE
    mood: 'chill',
  },
  {
    id: 'chillhop',
    titleKey: 'radio.station.chillhop',
    playlistId: 'PLt7bG0K25iXjJhkFxeUt5nR9tYX4Y9G5Q', // chillhop / jazzy beats — VALIDATE
    mood: 'chill',
  },
  {
    id: 'ambient',
    titleKey: 'radio.station.ambient',
    playlistId: 'PLnNbBqC5cy8y2Vd0j9k5cWyXAiJ2sT0kA', // deep space / ambient — VALIDATE
    mood: 'space',
  },
];

export const DEFAULT_STATION_ID = RADIO_STATIONS[0].id;
