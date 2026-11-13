import { describe, it, expect } from 'vitest';
import {
  isValidWebFolder,
  isValidWebPath,
  parseWebFiles,
  resolveWebPath,
  serializeWebFiles,
  startWebSite,
  WEB_MAX_FILES,
  WEB_MAX_LENGTH,
  type WebFile,
} from './webFiles.js';

describe('isValidWebPath', () => {
  it('takes files and folders of the kinds a site has', () => {
    for (const path of ['index.html', 'css/style.css', 'js/app.js', 'data.json', 'a/b/c/d/e.txt']) {
      expect(isValidWebPath(path)).toBe(true);
    }
    expect(isValidWebPath('img/rocket.png')).toBe(true);
  });

  it('refuses paths that climb out, hide or name an unknown kind', () => {
    for (const path of [
      '',
      '/index.html',
      '../index.html',
      'a/../index.html',
      './index.html',
      '.hidden.css',
      'index',
      'page.php',
      'my page.html',
      'a//b.css',
      'a/b/c/d/e/f.txt',
      `${'a'.repeat(100)}.css`,
    ]) {
      expect(isValidWebPath(path), path).toBe(false);
    }
  });
});

describe('isValidWebFolder', () => {
  it('takes folders a file can still go in', () => {
    for (const path of ['css', 'img/icons', 'a/b/c/d', 'v1.2']) {
      expect(isValidWebFolder(path), path).toBe(true);
    }
    for (const path of ['', '/css', 'a/../b', '..', 'a b', 'a/b/c/d/e', 'a//b']) {
      expect(isValidWebFolder(path), path).toBe(false);
    }
  });
});

describe('parseWebFiles and serializeWebFiles', () => {
  const files: WebFile[] = [
    { path: 'index.html', content: '<!DOCTYPE html>\n<h1>Station</h1>\n' },
    { path: 'css/style.css', content: 'h1 { color: red; }' },
    { path: 'notes.txt', content: 'A fence ``` inside\n````\nand more' },
    { path: 'empty.js', content: '' },
    { path: 'img/rocket.png', content: '', image: true },
    { path: 'video/launch.webm', content: '', image: true },
    { path: 'audio/countdown.mp3', content: '', image: true },
    { path: 'video/launch.vtt', content: 'WEBVTT\n\n00:00.000 --> 00:02.000\nLift off' },
  ];

  it('reads back what it wrote, backticks and empty files included', () => {
    expect(parseWebFiles(serializeWebFiles(files))).toEqual(files);
  });

  it('names each block by its language and path', () => {
    const text = serializeWebFiles(files);
    expect(text).toContain('```html index.html\n');
    expect(text).toContain('```css css/style.css\n');
    expect(text).toContain('`````text notes.txt\n');
    expect(text).toContain('```image img/rocket.png\n\n```');
    expect(text).toContain('```video video/launch.webm\n\n```');
    expect(text).toContain('```audio audio/countdown.mp3\n\n```');
    expect(text).toContain('```text video/launch.vtt\n');
  });

  it('leaves out invalid, repeated or mislabelled blocks and the text between them', () => {
    const text = [
      'Some words first.',
      '```html index.html',
      '<p>one</p>',
      '```',
      '```html index.html',
      '<p>again</p>',
      '```',
      '```js ../secret.js',
      'x',
      '```',
      '```image notes.txt',
      '```',
      '```html photo.png',
      '```',
      '```image video/launch.webm',
      '```',
      '```video audio/countdown.mp3',
      '```',
      '```python',
      'print(1)',
      '```',
    ].join('\n');
    expect(parseWebFiles(text)).toEqual([{ path: 'index.html', content: '<p>one</p>' }]);
  });

  it('keeps a block that never closes up to the end', () => {
    expect(parseWebFiles('```css a.css\nbody {}')).toEqual([{ path: 'a.css', content: 'body {}' }]);
  });

  it('reads an empty text as no files', () => {
    expect(parseWebFiles('')).toEqual([]);
    expect(serializeWebFiles([])).toBe('');
  });
});

describe('startWebSite', () => {
  const site: WebFile[] = [
    { path: 'index.html', content: '<h1>Mine</h1>' },
    { path: 'style.css', content: 'h1 { color: teal; }' },
  ];

  it('keeps the site and adds the new files after it', () => {
    const text = startWebSite(site, [{ path: 'crew.html', content: '' }]);
    expect(parseWebFiles(text!)).toEqual([...site, { path: 'crew.html', content: '' }]);
  });

  it('never replaces a file the site already has', () => {
    const text = startWebSite(site, [{ path: 'index.html', content: '' }]);
    expect(parseWebFiles(text!)).toEqual(site);
  });

  it('starts a lesson with nothing before it from its own files', () => {
    expect(startWebSite([], site)).toBe(serializeWebFiles(site));
  });

  it('gives nothing when the start would go past the limits', () => {
    const many = Array.from({ length: WEB_MAX_FILES }, (_, i) => ({
      path: `p${i}.txt`,
      content: '',
    }));
    expect(startWebSite(many, [{ path: 'one-more.txt', content: '' }])).toBeNull();
    const big = [{ path: 'big.txt', content: 'x'.repeat(WEB_MAX_LENGTH - 100) }];
    expect(startWebSite(big, [{ path: 'more.txt', content: 'y'.repeat(200) }])).toBeNull();
  });
});

describe('resolveWebPath', () => {
  it('follows relative and root paths inside the site', () => {
    expect(resolveWebPath('index.html', 'style.css')).toBe('style.css');
    expect(resolveWebPath('index.html', './css/a.css?v=2#top')).toBe('css/a.css');
    expect(resolveWebPath('pages/crew.html', '../index.html')).toBe('index.html');
    expect(resolveWebPath('pages/crew.html', '/img/a.png')).toBe('img/a.png');
    expect(resolveWebPath('js/main.js', './util.js')).toBe('js/util.js');
    expect(resolveWebPath('index.html', 'my%20page.html')).toBe('my page.html');
    expect(resolveWebPath('index.html', 'bad%E0.html')).toBe('bad%E0.html');
  });

  it('gives null for other sites, other schemes and paths that climb out', () => {
    for (const ref of [
      'https://example.com/a.css',
      '//example.com/a.css',
      'data:text/css,x',
      'mailto:a@b.c',
      '../outside.html',
      '#top',
      '',
      '/',
    ]) {
      expect(resolveWebPath('index.html', ref), ref).toBeNull();
    }
  });
});
