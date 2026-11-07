import {
  WEB_TEXT_EXTENSIONS,
  extensionOf,
  isValidWebFolder,
  isValidWebPath,
  type WebFile,
} from '@cyberstars/shared/webFiles';

// What the student does to the files of a web lesson's site (CYB-109): new
// files and folders, renames and deletions. A folder exists while a file is
// in it, or while the IDE keeps it empty (`folders`) for the visit.

export interface Site {
  files: WebFile[];
  folders: string[];
}

export type SiteError = 'invalidFile' | 'invalidFolder' | 'taken' | 'image';
type Outcome = { site: Site } | { error: SiteError };

// Every folder of the site, empty ones too, each once
export function foldersOf(site: Site): string[] {
  const all = new Set(site.folders);
  for (const file of site.files) {
    const parts = file.path.split('/').slice(0, -1);
    for (let i = 1; i <= parts.length; i++) all.add(parts.slice(0, i).join('/'));
  }
  return [...all].sort();
}

const inside = (path: string, folder: string) => path.startsWith(`${folder}/`);

// Whether `path` is free for a new file or folder: no file or folder has it,
// and no file stands where one of its folders would be
function isFree(site: Site, path: string, ignore: (p: string) => boolean = () => false): boolean {
  const files = site.files.map((f) => f.path).filter((p) => !ignore(p));
  const folders = foldersOf({ ...site, files: site.files.filter((f) => !ignore(f.path)) });
  if (files.includes(path) || folders.includes(path)) return false;
  return !files.some((file) => inside(path, file));
}

export function addFile(site: Site, path: string): Outcome {
  if (!isValidWebPath(path) || !WEB_TEXT_EXTENSIONS.includes(extensionOf(path))) {
    return { error: 'invalidFile' };
  }
  if (!isFree(site, path)) return { error: 'taken' };
  return {
    site: {
      files: [...site.files, { path, content: '' }],
      folders: site.folders.filter((f) => !inside(path, f)),
    },
  };
}

export function addFolder(site: Site, path: string): Outcome {
  if (!isValidWebFolder(path)) return { error: 'invalidFolder' };
  if (!isFree(site, path)) return { error: 'taken' };
  return { site: { ...site, folders: [...site.folders, path] } };
}

// A file keeps its content under its new path; a folder takes everything in
// it along. An image of the lesson stays where it is.
export function renamePath(site: Site, from: string, to: string): Outcome {
  if (from === to) return { site };
  const file = site.files.find((f) => f.path === from);
  if (file) {
    if (file.image) return { error: 'image' };
    if (!isValidWebPath(to) || !WEB_TEXT_EXTENSIONS.includes(extensionOf(to))) {
      return { error: 'invalidFile' };
    }
    if (!isFree(site, to, (p) => p === from)) return { error: 'taken' };
    return {
      site: {
        files: site.files.map((f) => (f.path === from ? { ...f, path: to } : f)),
        folders: site.folders.filter((f) => !inside(to, f)),
      },
    };
  }
  if (!isValidWebFolder(to)) return { error: 'invalidFolder' };
  if (site.files.some((f) => f.image && inside(f.path, from))) return { error: 'image' };
  if (inside(to, from) || !isFree(site, to, (p) => inside(p, from))) return { error: 'taken' };
  const moved = (p: string) => (p === from || inside(p, from) ? to + p.slice(from.length) : p);
  const files = site.files.map((f) => ({ ...f, path: moved(f.path) }));
  if (!files.every((f) => isValidWebPath(f.path))) return { error: 'invalidFolder' };
  return { site: { files, folders: site.folders.map(moved) } };
}

export function removePath(site: Site, path: string): Outcome {
  const file = site.files.find((f) => f.path === path);
  if (file?.image || (!file && site.files.some((f) => f.image && inside(f.path, path)))) {
    return { error: 'image' };
  }
  return {
    site: {
      files: site.files.filter((f) => f.path !== path && !inside(f.path, path)),
      folders: site.folders.filter((f) => f !== path && !inside(f, path)),
    },
  };
}
