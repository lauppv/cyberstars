import { extensionOf, resolveWebPath, type WebFile } from '@cyberstars/shared/webFiles';
import { guardScript } from './scriptGuard';
import { previewPrelude, type PreludeConfig } from './previewPrelude';

// One page of the student's site, made ready for the preview frame
// (public/web-preview.html, CYB-109). The page's own HTML, with:
//
// * the prelude first in its head (previewPrelude.ts);
// * each style sheet of the site in place of its <link>, as a <style>, and
//   in place of its @import;
// * each script of the site named by a token, which the frame swaps for a
//   blob: URL it makes from `scripts` (an external script keeps its src, so
//   `defer` and `async` mean what they mean on a real site);
// * images, videos and sounds of the site as data: URLs, and a video's
//   words (a <track>'s file) too;
// * a guard in every loop (scriptGuard.ts), the loops of its handlers
//   (onclick="…") too.
//
// A reference to a file the site doesn't have is listed in `missing`, for the
// console to say so.

interface PreviewScript {
  token: string;
  code: string;
  // The tokens of the scripts it imports
  deps: string[];
}

export interface PreviewPage {
  html: string;
  scripts: PreviewScript[];
  // Each file a reference named that the site doesn't have, with where
  missing: { file: string; from: string }[];
}

export interface PreviewOptions {
  files: WebFile[];
  page: string;
  // A data: URL for each image, video or sound of the site that could be loaded
  images: Record<string, string>;
  prelude: Omit<PreludeConfig, 'page' | 'files' | 'scripts'>;
}

const JS_TYPES = new Set([
  '',
  'module',
  'text/javascript',
  'application/javascript',
  'text/ecmascript',
  'application/ecmascript',
]);

// A JSON value written inside a <script>: no `<` can end it early
function scriptJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function buildPreviewPage({ files, page, images, prelude }: PreviewOptions): PreviewPage {
  const text = new Map(files.filter((f) => !f.image).map((f) => [f.path, f.content]));
  const scripts: PreviewScript[] = [];
  const tokens = new Map<string, string>();
  const scriptNames: Record<string, string> = {};
  const missing: PreviewPage['missing'] = [];
  const missed = (file: string, from: string) => {
    if (!missing.some((m) => m.file === file && m.from === from)) missing.push({ file, from });
  };
  let loops = 0;
  // The files a script imports, guarded once the script itself is: guarding
  // one inside another would number both files' loops from the same place
  const pending: (() => void)[] = [];
  const guardPending = () => {
    for (let next = pending.shift(); next; next = pending.shift()) next();
  };

  const guard = (code: string, module: boolean, label: string, from: string, firstLine = 1) => {
    const deps: string[] = [];
    const out = guardScript(code, {
      module,
      label,
      firstLoop: loops,
      firstLine,
      importTarget: module
        ? (specifier) => {
            const path = resolveWebPath(from, specifier);
            if (path === null) return null;
            const token = scriptToken(path, true, from);
            if (token !== null) deps.push(token);
            return token;
          }
        : undefined,
    });
    loops += out.loops;
    return { code: out.code, deps };
  };

  // The token a script of the site runs under, made once per file and kind;
  // null when the site has no such file
  function scriptToken(path: string, module: boolean, from: string): string | null {
    const key = `${module ? 'module' : 'script'}:${path}`;
    const known = tokens.get(key);
    if (known) return known;
    const code = text.get(path);
    if (code === undefined || extensionOf(path) !== 'js') {
      missed(path, from);
      return null;
    }
    const token = `cyberstars-file-${tokens.size}-end`;
    tokens.set(key, token);
    scriptNames[token] = path;
    const script: PreviewScript = { token, code: '', deps: [] };
    scripts.push(script);
    pending.push(() => {
      const guarded = guard(code, module, path, path);
      script.code = `${guarded.code}\n//# sourceURL=${path}`;
      script.deps = guarded.deps;
    });
    return token;
  }

  // url(...) in a style sheet of `from`: an image of the site becomes its data
  const styleUrls = (css: string, from: string) =>
    css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (whole, _quote, ref: string) => {
      const path = resolveWebPath(from, ref);
      if (path === null) return whole;
      const data = images[path];
      if (data) return `url("${data}")`;
      missed(path, from);
      return whole;
    });

  // A style sheet of `from` with its @imports of the site's sheets put in
  // place, wrapped in their media, and its images as data
  const IMPORT = /@import\s+(?:url\(\s*(['"]?)([^'")]+)\1\s*\)|(['"])([^'"]+)\3)\s*([^;]*);/g;
  const styleSheet = (css: string, from: string, seen: string[] = [from]): string => {
    const inlined: string[] = [];
    const marked = css.replace(
      IMPORT,
      (whole, _q, urlRef?: string, _q2?: string, textRef?: string, media = '') => {
        const path = resolveWebPath(from, urlRef ?? textRef ?? '');
        if (path === null) return whole;
        const imported = text.get(path);
        if (imported === undefined || extensionOf(path) !== 'css') {
          missed(path, from);
          return whole;
        }
        // Sheets that import each other in a circle are put in once
        if (seen.includes(path)) return '';
        const sheet = styleSheet(imported, path, [...seen, path]);
        inlined.push(media.trim() ? `@media ${media.trim()} {\n${sheet}\n}` : sheet);
        return `\ue000${inlined.length - 1}\ue001`;
      },
    );
    return styleUrls(marked, from).replace(/\ue000(\d+)\ue001/g, (_m, i: string) => inlined[+i]);
  };
  // Nothing in a sheet can close its <style> early
  const styleText = (css: string) => css.replace(/<\/(style)/gi, '<\\/$1');

  const doc = new DOMParser().parseFromString(text.get(page) ?? '', 'text/html');

  // The page's own <style>s first: the style sheets put in below have their
  // images done already, from their own folder
  for (const style of Array.from(doc.querySelectorAll('style'))) {
    if (style.textContent) style.textContent = styleText(styleSheet(style.textContent, page));
  }
  for (const link of Array.from(doc.querySelectorAll('link[href]'))) {
    const rel = (link.getAttribute('rel') ?? '').toLowerCase().split(/\s+/);
    if (!rel.includes('stylesheet')) continue;
    const path = resolveWebPath(page, link.getAttribute('href') ?? '');
    if (path === null) continue;
    const css = text.get(path);
    if (css === undefined || extensionOf(path) !== 'css') {
      missed(path, page);
      continue;
    }
    const style = doc.createElement('style');
    const media = link.getAttribute('media');
    if (media) style.setAttribute('media', media);
    style.textContent = styleText(styleSheet(css, path));
    link.replaceWith(style);
  }
  for (const el of Array.from(doc.querySelectorAll('[style]'))) {
    el.setAttribute('style', styleUrls(el.getAttribute('style') ?? '', page));
  }
  // A picture, a video, a sound or a video's first picture (`poster`)
  const media: [string, string][] = [
    ['img', 'src'],
    ['video', 'src'],
    ['video', 'poster'],
    ['audio', 'src'],
    ['source', 'src'],
  ];
  for (const [tag, attr] of media) {
    for (const el of Array.from(doc.querySelectorAll(`${tag}[${attr}]`))) {
      const path = resolveWebPath(page, el.getAttribute(attr) ?? '');
      if (path === null) continue;
      const data = images[path];
      if (data) el.setAttribute(attr, data);
      else missed(path, page);
    }
  }
  // A video's words are a text file of the site
  for (const track of Array.from(doc.querySelectorAll('track[src]'))) {
    const path = resolveWebPath(page, track.getAttribute('src') ?? '');
    if (path === null) continue;
    const words = text.get(path);
    if (words !== undefined && extensionOf(path) === 'vtt') {
      track.setAttribute('src', `data:text/vtt;charset=utf-8,${encodeURIComponent(words)}`);
    } else missed(path, page);
  }

  // A script inside the page is found in its source text, in order, so its
  // loops name the line of the page they are on
  const source = text.get(page) ?? '';
  let searchFrom = 0;
  const lineOf = (code: string) => {
    const at = source.indexOf(code, searchFrom);
    if (at < 0) return 1;
    searchFrom = at + code.length;
    return source.slice(0, at).split('\n').length;
  };
  for (const script of Array.from(doc.querySelectorAll('script'))) {
    const type = (script.getAttribute('type') ?? '').trim().toLowerCase();
    if (!JS_TYPES.has(type)) continue;
    const module = type === 'module';
    const src = script.getAttribute('src');
    if (src !== null) {
      const path = resolveWebPath(page, src);
      if (path === null) continue;
      const token = scriptToken(path, module, page);
      if (token !== null) script.setAttribute('src', token);
    } else if (script.textContent) {
      const code = script.textContent;
      script.textContent = guard(code, module, page, page, lineOf(code)).code;
    }
    guardPending();
  }
  // A handler's loops name the line the handler is first written on
  for (const el of Array.from(doc.querySelectorAll('*'))) {
    for (const attr of Array.from(el.attributes)) {
      if (!attr.name.toLowerCase().startsWith('on')) continue;
      const at = source.indexOf(attr.value);
      const out = guardScript(attr.value, {
        module: false,
        handler: true,
        label: page,
        firstLoop: loops,
        firstLine: at < 0 ? 1 : source.slice(0, at).split('\n').length,
      });
      loops += out.loops;
      if (out.loops > 0) el.setAttribute(attr.name, out.code);
    }
  }

  const config: PreludeConfig = {
    ...prelude,
    page,
    files: Object.fromEntries(text),
    scripts: scriptNames,
  };
  const head = doc.head;
  const first = doc.createElement('script');
  first.textContent = `(${previewPrelude.toString()})(${scriptJson(config)});`;
  head.insertBefore(first, head.firstChild);

  const doctype = doc.doctype ? new XMLSerializer().serializeToString(doc.doctype) : '';
  return { html: doctype + doc.documentElement.outerHTML, scripts, missing };
}
