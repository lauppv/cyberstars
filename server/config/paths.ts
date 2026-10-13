import path from 'path';

// The repo root, found from this file so it doesn't matter which folder the
// server, a script or a test was started from
const REPO_ROOT = path.resolve(import.meta.dirname, '../..');

// These live on the server's disk at the repo root, outside git, so they stay
// put when the code moves around: the secrets, uploaded avatars and the radio audio
export const ENV_FILE = path.join(REPO_ROOT, '.env');
export const UPLOADS_DIR = path.join(REPO_ROOT, 'uploads');
export const RADIO_DIR = path.join(REPO_ROOT, 'media', 'radio');

export const UI_BUILD_DIR = path.join(REPO_ROOT, 'apps', 'ui', 'dist');
