// Single source of truth for the Focus Radio track. Client-only: one long,
// self-hosted, royalty-free instrumental file. We play it through a plain HTML5
// <audio> element and fake a "live" broadcast by seeking every listener to
// (serverNow % duration) — see RadioContext. No YouTube, no video, no ads, no
// per-user backend cost.
//
// The mp3 is gitignored (163MB) and lives in media/radio/ — OUTSIDE public/ so
// builds don't copy it into dist/. In dev Express serves /radio from there; in
// prod nginx serves it straight from disk (location /radio/). It must be CBR
// (VBR duration estimates differ across browsers and break the live sync).

export interface RadioTrack {
  src: string; // /radio/ path (nginx in prod, Express static in dev)
  titleKey: string; // i18n key for the display label
}

export const RADIO_TRACK: RadioTrack = {
  src: '/radio/neon-skylines.mp3',
  titleKey: 'radio.track.neonSkylines',
};
