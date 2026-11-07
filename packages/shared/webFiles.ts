// The files of a web lesson's site (CYB-109), kept as one text: a fenced block
// per file whose info string names its language and path,
//
//   ```html index.html
//   <!DOCTYPE html>
//   ```
//
// The starter (<slug>-code.md), the reference (<slug>-solution.md), the
// student's saved code, the tutor's view of the work and a forum post all use
// it, so a site is saved, reset and shared like any lesson's code. An image
// is a block with the `image` language and nothing in it: it names a file of
// the course's `assets/` folder, read-only in the lesson.

export interface WebFile {
  path: string;
  content: string;
  // An image the lesson brings, never written by the student
  image?: boolean;
}

// The file the preview runs in, served with a security policy of its own
// (apps/api/src/app.ts)
export const WEB_PREVIEW_PATH = '/web-preview.html';

// What a student may write, by extension, with the language its block names
const TEXT_LANGUAGES: Record<string, string> = {
  html: 'html',
  css: 'css',
  js: 'js',
  json: 'json',
  txt: 'text',
};
export const WEB_TEXT_EXTENSIONS = Object.keys(TEXT_LANGUAGES);
const WEB_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];

// A site's limits: the saved text has the cap of any lesson's code
export const WEB_MAX_FILES = 30;
export const WEB_MAX_LENGTH = 50_000;

const SEGMENT = /^[A-Za-z0-9_-][A-Za-z0-9._-]*$/;
const MAX_DEPTH = 4;
const MAX_PATH_LENGTH = 100;

export function extensionOf(path: string): string {
  const name = path.slice(path.lastIndexOf('/') + 1);
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
}

export function isImagePath(path: string): boolean {
  return WEB_IMAGE_EXTENSIONS.includes(extensionOf(path));
}

// A folder inside the site: names of letters, digits, dots, dashes and
// underscores, no `.` or `..`, deep enough to still hold a file
export function isValidWebFolder(path: string): boolean {
  const segments = path.split('/');
  return (
    path.length > 0 &&
    path.length < MAX_PATH_LENGTH &&
    segments.length <= MAX_DEPTH &&
    segments.every((s) => SEGMENT.test(s) && s !== '.' && s !== '..')
  );
}

// A path inside the site: folders and a file name of letters, digits, dots,
// dashes and underscores, no `.` or `..`, with an extension the site knows
export function isValidWebPath(path: string): boolean {
  if (path.length === 0 || path.length > MAX_PATH_LENGTH) return false;
  const segments = path.split('/');
  if (segments.length > MAX_DEPTH + 1) return false;
  if (!segments.every((s) => SEGMENT.test(s) && s !== '.' && s !== '..')) return false;
  const ext = extensionOf(path);
  return WEB_TEXT_EXTENSIONS.includes(ext) || WEB_IMAGE_EXTENSIONS.includes(ext);
}

// The language a file's block names
function blockLanguage(file: WebFile): string {
  return file.image ? 'image' : (TEXT_LANGUAGES[extensionOf(file.path)] ?? 'text');
}

const OPENING = /^(`{3,})(\S+)[ \t]+(\S+)[ \t]*$/;

// The files a text holds, in order. A block that doesn't name a valid path,
// or names one a block before it named, is left out; so is anything between
// the blocks.
export function parseWebFiles(text: string): WebFile[] {
  const lines = text.split('\n');
  const files: WebFile[] = [];
  const seen = new Set<string>();
  let i = 0;
  while (i < lines.length) {
    const open = OPENING.exec(lines[i]);
    i++;
    if (!open) continue;
    const [, fence, language, path] = open;
    const body: string[] = [];
    // A fence closes on a line of at least as many backticks and nothing else
    while (
      i < lines.length &&
      !(/^`+[ \t]*$/.test(lines[i]) && lines[i].trim().length >= fence.length)
    ) {
      body.push(lines[i]);
      i++;
    }
    i++;
    const image = language === 'image';
    if (!isValidWebPath(path) || seen.has(path) || image !== isImagePath(path)) continue;
    seen.add(path);
    files.push(image ? { path, content: '', image: true } : { path, content: body.join('\n') });
  }
  return files;
}

// The text of a set of files, which parseWebFiles reads back as it was. A
// block's fence is longer than any run of backticks inside it.
export function serializeWebFiles(files: WebFile[]): string {
  return files
    .map((file) => {
      const content = file.image ? '' : file.content;
      const longest = Math.max(0, ...(content.match(/`+/g) ?? []).map((run) => run.length));
      const fence = '`'.repeat(Math.max(3, longest + 1));
      return `${fence}${blockLanguage(file)} ${file.path}\n${content}\n${fence}`;
    })
    .join('\n\n');
}

function decoded(part: string): string {
  try {
    return decodeURIComponent(part);
  } catch {
    return part;
  }
}

// Where a link, a source or an import in `from` leads: a path inside the site,
// or null for an address elsewhere (another site, a data: URL) or one that
// climbs out of the site. A query or a fragment is dropped.
export function resolveWebPath(from: string, ref: string): string | null {
  const bare = ref.trim().split(/[?#]/)[0];
  if (!bare || /^[a-z][a-z0-9+.-]*:/i.test(bare) || bare.startsWith('//')) return null;
  const parts = bare.startsWith('/') ? [] : from.split('/').slice(0, -1);
  for (const part of bare.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (parts.length === 0) return null;
      parts.pop();
    } else {
      parts.push(decoded(part));
    }
  }
  return parts.length ? parts.join('/') : null;
}
