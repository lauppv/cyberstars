// Single source of truth for the Focus Radio track. Client-only: one long,
// self-hosted, royalty-free instrumental file served as a static asset from
// public/radio/. We play it through a plain HTML5 <audio> element and fake a
// "live" broadcast by seeking every listener to (serverNow % duration) — see
// RadioContext. No YouTube, no video, no ads, no per-user backend cost.
//
// The mp3 is gitignored (163MB); it must be present at public/radio/ locally and
// uploaded manually to the server's public/radio/ on deploy.

export interface RadioTrack {
  src: string; // static path under public/
  titleKey: string; // i18n key for the display label
}

export const RADIO_TRACK: RadioTrack = {
  src: '/radio/neon-skylines.mp3',
  titleKey: 'radio.track.neonSkylines',
};
