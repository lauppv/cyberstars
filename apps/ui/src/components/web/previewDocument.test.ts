import { describe, it, expect } from 'vitest';
import type { WebFile } from '@cyberstars/shared/webFiles';
import { buildPreviewPage, srcsetCandidates } from './previewDocument';

const prelude = {
  parentOrigin: 'http://localhost:5173',
  storage: {},
  loopMessage: 'Stopped a loop on line {line} of {file}',
  loopLimitMs: 2000,
  evalMessage: 'No code in strings',
};

function build(files: WebFile[], page = 'index.html', images: Record<string, string> = {}) {
  const out = buildPreviewPage({ files, page, images, prelude });
  const doc = new DOMParser().parseFromString(out.html, 'text/html');
  return { ...out, doc };
}

describe('buildPreviewPage', () => {
  it('puts the prelude first in the head, with the site and the page it shows', () => {
    const { doc, html } = build([
      { path: 'index.html', content: '<!DOCTYPE html><html><head><title>T</title></head></html>' },
      { path: 'data.json', content: '{"a":"</script>"}' },
    ]);
    expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
    const first = doc.head.firstElementChild!;
    expect(first.tagName).toBe('SCRIPT');
    expect(first.textContent).toContain('"page":"index.html"');
    // The site's files are in, and nothing in them can end the script early
    expect(first.textContent).toContain('\\u003c/script>');
    expect(first.textContent).not.toContain('</script>');
  });

  it('keeps a page without a doctype without one', () => {
    expect(build([{ path: 'index.html', content: '<p>hi</p>' }]).html.startsWith('<html')).toBe(
      true,
    );
  });

  it('puts each style sheet of the site in place of its link, its images as data', () => {
    const { doc, missing } = build(
      [
        {
          path: 'index.html',
          content:
            '<link rel="stylesheet" href="css/site.css" media="screen"><link rel="stylesheet" href="https://cdn.example/x.css"><link rel="stylesheet" href="gone.css">',
        },
        {
          path: 'css/site.css',
          content: 'body { background: url(../img/sky.png); } p { background: url("nope.png") }',
        },
        { path: 'img/sky.png', content: '', image: true },
      ],
      'index.html',
      { 'img/sky.png': 'data:image/png;base64,AAA' },
    );
    const style = doc.querySelector('style')!;
    expect(style.getAttribute('media')).toBe('screen');
    expect(style.textContent).toContain('url("data:image/png;base64,AAA")');
    expect(doc.querySelector('link[href="https://cdn.example/x.css"]')).not.toBeNull();
    expect(missing).toEqual([
      { file: 'css/nope.png', from: 'css/site.css' },
      { file: 'gone.css', from: 'index.html' },
    ]);
  });

  it("puts a style sheet's @imports of the site's sheets in place", () => {
    const { doc, missing } = build(
      [
        {
          path: 'index.html',
          content:
            '<link rel="stylesheet" href="css/site.css"><style>@import "css/theme.css";</style>',
        },
        {
          path: 'css/site.css',
          content:
            '@import url("theme.css");\n@import url(print.css) print;\n@import "gone.css";\n@import url(https://fonts.example/a.css);\nh1 { color: red; }',
        },
        {
          path: 'css/theme.css',
          content: '@import "site.css"; body { background: url(../sky.png); }',
        },
        { path: 'css/print.css', content: 'nav { display: none; }' },
        { path: 'sky.png', content: '', image: true },
      ],
      'index.html',
      { 'sky.png': 'data:image/png;base64,AAA' },
    );
    const [linked, own] = Array.from(doc.querySelectorAll('style'), (s) => s.textContent);
    expect(linked).toContain('body { background: url("data:image/png;base64,AAA"); }');
    expect(linked).toContain('@media print {\nnav { display: none; }\n}');
    expect(linked).toContain('@import "gone.css";');
    expect(linked).toContain('@import url(https://fonts.example/a.css);');
    expect(linked).not.toContain('theme.css');
    // A sheet importing the one that imported it is put in once
    expect(linked!.match(/h1 \{/g)).toHaveLength(1);
    expect(own).toContain('body { background: url("data:image/png;base64,AAA"); }');
    expect(missing).toEqual([{ file: 'css/gone.css', from: 'css/site.css' }]);
  });

  it('keeps a style sheet from closing its <style> early', () => {
    const { doc } = build([
      { path: 'index.html', content: '<link rel="stylesheet" href="a.css"><p>after</p>' },
      { path: 'a.css', content: 'p::after { content: "</style><b>x</b>"; }' },
    ]);
    expect(doc.querySelector('b')).toBeNull();
    expect(doc.querySelector('p')!.textContent).toBe('after');
  });

  it("gives the page's images and inline styles their data", () => {
    const { doc, missing } = build(
      [
        {
          path: 'pages/crew.html',
          content:
            '<img src="../img/a.png" alt="a"><img src="https://x.example/b.png"><div style="background: url(\'/img/a.png\')"></div><style>h1 { background: url(../img/a.png) }</style>',
        },
      ],
      'pages/crew.html',
      { 'img/a.png': 'data:image/png;base64,QQ' },
    );
    expect(doc.querySelector('img[alt="a"]')!.getAttribute('src')).toBe('data:image/png;base64,QQ');
    expect(doc.querySelector('img:not([alt])')!.getAttribute('src')).toBe(
      'https://x.example/b.png',
    );
    expect(doc.querySelector('div')!.getAttribute('style')).toContain('data:image/png;base64,QQ');
    expect(doc.querySelectorAll('style')[0].textContent).toContain('data:image/png;base64,QQ');
    expect(missing).toEqual([]);
  });

  it('gives each file a srcset offers its data, on an <img> and a <source>', () => {
    const { doc, missing } = build(
      [
        {
          path: 'index.html',
          content:
            '<picture><source media="(max-width: 400px)" srcset="img/earth-square.jpg"><img src="img/earth-large.jpg" srcset="img/earth-small.jpg 640w,img/earth-large.jpg 1280w, https://x.example/c.jpg 2x, img/gone.jpg 3x"></picture>',
        },
      ],
      'index.html',
      {
        'img/earth-square.jpg': 'data:image/jpeg;base64,Uw',
        'img/earth-small.jpg': 'data:image/jpeg;base64,U00',
        'img/earth-large.jpg': 'data:image/jpeg;base64,TA',
      },
    );
    expect(doc.querySelector('source')!.getAttribute('srcset')).toBe('data:image/jpeg;base64,Uw');
    expect(doc.querySelector('img')!.getAttribute('srcset')).toBe(
      'data:image/jpeg;base64,U00 640w, data:image/jpeg;base64,TA 1280w, https://x.example/c.jpg 2x, img/gone.jpg 3x',
    );
    expect(missing).toEqual([{ file: 'img/gone.jpg', from: 'index.html' }]);
  });

  it("gives the page's videos and sounds their data, and a video's words their text", () => {
    const { doc, missing } = build(
      [
        {
          path: 'index.html',
          content:
            '<video src="video/launch.webm" poster="img/a.png"><track src="video/launch.vtt" kind="captions"></video><audio><source src="audio/beep.mp3"></audio><video src="video/gone.webm"><track src="gone.vtt"></video>',
        },
        { path: 'video/launch.vtt', content: 'WEBVTT\n\n00:00.000 --> 00:01.000\nGo & see' },
      ],
      'index.html',
      {
        'video/launch.webm': 'data:video/webm;base64,V',
        'img/a.png': 'data:image/png;base64,QQ',
        'audio/beep.mp3': 'data:audio/mpeg;base64,A',
      },
    );
    const [video] = Array.from(doc.querySelectorAll('video'));
    expect(video.getAttribute('src')).toBe('data:video/webm;base64,V');
    expect(video.getAttribute('poster')).toBe('data:image/png;base64,QQ');
    expect(doc.querySelector('source')!.getAttribute('src')).toBe('data:audio/mpeg;base64,A');
    expect(doc.querySelector('track')!.getAttribute('src')).toBe(
      `data:text/vtt;charset=utf-8,${encodeURIComponent('WEBVTT\n\n00:00.000 --> 00:01.000\nGo & see')}`,
    );
    expect(missing).toEqual([
      { file: 'video/gone.webm', from: 'index.html' },
      { file: 'gone.vtt', from: 'index.html' },
    ]);
  });

  it("names the site's scripts by tokens, guarded, and leaves other kinds alone", () => {
    const { doc, scripts, missing } = build([
      {
        path: 'index.html',
        content: [
          '<script src="js/app.js" defer></script>',
          '<script>while (true) {}</script>',
          '<script type="application/json">{"while": true}</script>',
          '<script src="https://cdn.example/lib.js"></script>',
          '<script src="missing.js"></script>',
        ].join(''),
      },
      { path: 'js/app.js', content: 'for (;;) {}' },
    ]);
    const tags = Array.from(doc.querySelectorAll('body script, head script')).slice(1);
    expect(tags[0].getAttribute('src')).toBe(scripts[0].token);
    expect(tags[0].hasAttribute('defer')).toBe(true);
    expect(scripts[0].code).toContain('__cyberstars.t(0)');
    expect(scripts[0].code.endsWith('//# sourceURL=js/app.js')).toBe(true);
    expect(tags[1].textContent).toContain('__cyberstars.t(1)');
    expect(tags[2].textContent).toBe('{"while": true}');
    expect(tags[3].getAttribute('src')).toBe('https://cdn.example/lib.js');
    expect(tags[4].getAttribute('src')).toBe('missing.js');
    expect(missing).toEqual([{ file: 'missing.js', from: 'index.html' }]);
    // The prelude knows which file each token is
    expect(doc.head.firstElementChild!.textContent).toContain(`"${scripts[0].token}":"js/app.js"`);
  });

  it("names the page's line for a loop in a script inside it", () => {
    const { doc } = build([
      {
        path: 'index.html',
        content:
          '<h1>a</h1>\n<script>\nlet x = 1;\n</script>\n<p>b</p>\n<script>\n\nwhile (x) {}\n</script>',
      },
    ]);
    const scripts = doc.querySelectorAll('script');
    expect(scripts[scripts.length - 1].textContent).toContain(
      'throw __cyberstars.e(8,"index.html")',
    );
  });

  it('follows the imports of a module, making each file once', () => {
    const { scripts, missing } = build([
      {
        path: 'index.html',
        content:
          '<script type="module" src="main.js"></script><script type="module">import "./util.js";</script>',
      },
      { path: 'main.js', content: "import { a } from './util.js';\nimport './nope.js';" },
      { path: 'util.js', content: 'export const a = 1;' },
    ]);
    expect(scripts.map((s) => s.code.split('\n').pop())).toEqual([
      '//# sourceURL=main.js',
      '//# sourceURL=util.js',
    ]);
    const [main, util] = scripts;
    expect(main.deps).toEqual([util.token]);
    expect(main.code).toContain(`from "${util.token}"`);
    expect(main.code).toContain("import './nope.js'");
    expect(missing).toEqual([{ file: 'nope.js', from: 'main.js' }]);
  });

  it('numbers the loops of every file apart, an imported one too', () => {
    const { doc, scripts } = build([
      {
        path: 'index.html',
        content: '<script type="module" src="main.js"></script><script>for (;;) {}</script>',
      },
      { path: 'main.js', content: "import { step } from './util.js';\nwhile (true) { step(); }" },
      { path: 'util.js', content: 'export function step() { for (const x of [1, 2]) {} }' },
    ]);
    const code = [
      ...scripts.map((s) => s.code),
      ...Array.from(doc.querySelectorAll('script'))
        .slice(1)
        .map((s) => s.textContent ?? ''),
    ].join('\n');
    const ids = Array.from(code.matchAll(/__cyberstars\.s\((\d+)\)/g), (m) => m[1]);
    expect(ids).toHaveLength(3);
    expect(new Set(ids).size).toBe(3);
  });

  it("guards the loops of the page's handlers, and leaves the others alone", () => {
    const { doc } = build([
      {
        path: 'index.html',
        content:
          '<script>for (;;) {}</script>\n<button onclick="while (true) {}">a</button>\n<p onmouseover="if (x) return false; go()">b</p>',
      },
    ]);
    expect(doc.querySelector('button')!.getAttribute('onclick')).toBe(
      '{__cyberstars.s(1);while (true) {if(__cyberstars.t(1))throw __cyberstars.e(2,"index.html");}}',
    );
    expect(doc.querySelector('p')!.getAttribute('onmouseover')).toBe('if (x) return false; go()');
  });

  it('shows an empty page for a page the site lacks', () => {
    const { doc } = build([{ path: 'index.html', content: '<p>x</p>' }], 'other.html');
    expect(doc.body.textContent).toBe('');
  });
});

describe('srcsetCandidates', () => {
  it('reads each URL to its first space, with what follows it to the next comma', () => {
    expect(srcsetCandidates(' a.jpg 640w ,b.jpg  2x,c.jpg,, data:image/png;base64,QQ 3x ')).toEqual(
      [
        { url: 'a.jpg', descriptor: '640w' },
        { url: 'b.jpg', descriptor: '2x' },
        { url: 'c.jpg', descriptor: '' },
        { url: 'data:image/png;base64,QQ', descriptor: '3x' },
      ],
    );
    expect(srcsetCandidates('')).toEqual([]);
  });
});
