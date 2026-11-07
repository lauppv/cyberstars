import { describe, it, expect } from 'vitest';
import type { WebFile } from '@cyberstars/shared/webFiles';
import { buildPreviewPage } from './previewDocument';

const prelude = {
  parentOrigin: 'http://localhost:5173',
  storage: {},
  loopMessage: 'Stopped a loop on line {line} of {file}',
  loopLimitMs: 2000,
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

  it('shows an empty page for a page the site lacks', () => {
    const { doc } = build([{ path: 'index.html', content: '<p>x</p>' }], 'other.html');
    expect(doc.body.textContent).toBe('');
  });
});
