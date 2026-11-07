import { describe, it, expect } from 'vitest';
import { addFile, addFolder, foldersOf, removePath, renamePath, type Site } from './siteFiles';

const site: Site = {
  files: [
    { path: 'index.html', content: '<h1>Hi</h1>' },
    { path: 'css/style.css', content: 'h1 {}' },
    { path: 'css/print/a.css', content: '' },
    { path: 'img/logo.png', content: '', image: true },
  ],
  folders: ['js'],
};

const paths = (outcome: ReturnType<typeof addFile>) =>
  'site' in outcome ? outcome.site.files.map((f) => f.path) : outcome.error;

describe('foldersOf', () => {
  it('lists every folder once, the empty ones too', () => {
    expect(foldersOf(site)).toEqual(['css', 'css/print', 'img', 'js']);
  });
});

describe('addFile', () => {
  it('adds an empty file, its folders with it', () => {
    const out = addFile(site, 'js/app.js');
    expect(paths(out)).toEqual([
      'index.html',
      'css/style.css',
      'css/print/a.css',
      'img/logo.png',
      'js/app.js',
    ]);
    // The folder kept empty holds a file now
    expect('site' in out && out.site.folders).toEqual([]);
  });

  it('refuses a name the site has, a bad name or an image', () => {
    expect(paths(addFile(site, 'index.html'))).toBe('taken');
    expect(paths(addFile(site, 'css'))).toBe('invalidFile');
    expect(paths(addFile(site, 'index.html/a.css'))).toBe('taken');
    expect(paths(addFile(site, 'a.png'))).toBe('invalidFile');
    expect(paths(addFile(site, '../a.css'))).toBe('invalidFile');
  });
});

describe('addFolder', () => {
  it('keeps an empty folder', () => {
    const out = addFolder(site, 'pages');
    expect('site' in out && out.site.folders).toEqual(['js', 'pages']);
  });

  it('refuses a folder the site has or a file stands on', () => {
    expect(addFolder(site, 'css')).toEqual({ error: 'taken' });
    expect(addFolder(site, 'js')).toEqual({ error: 'taken' });
    expect(addFolder(site, 'index.html')).toEqual({ error: 'taken' });
    expect(addFolder(site, 'a/../b')).toEqual({ error: 'invalidFolder' });
  });
});

describe('renamePath', () => {
  it('moves a file with its content', () => {
    const out = renamePath(site, 'css/style.css', 'js/style.css');
    expect('site' in out && out.site.files[1]).toEqual({
      path: 'js/style.css',
      content: 'h1 {}',
    });
    expect('site' in out && out.site.folders).toEqual([]);
  });

  it('moves a folder with everything in it', () => {
    const out = renamePath(site, 'css', 'styles');
    expect(paths(out)).toEqual([
      'index.html',
      'styles/style.css',
      'styles/print/a.css',
      'img/logo.png',
    ]);
    const empty = renamePath(site, 'js', 'scripts');
    expect('site' in empty && empty.site.folders).toEqual(['scripts']);
  });

  it('refuses names taken, bad names, a folder into itself and images', () => {
    expect(renamePath(site, 'css/style.css', 'index.html')).toEqual({ error: 'taken' });
    expect(renamePath(site, 'css/style.css', 'style')).toEqual({ error: 'invalidFile' });
    expect(renamePath(site, 'css', 'js')).toEqual({ error: 'taken' });
    expect(renamePath(site, 'css', 'css/inner')).toEqual({ error: 'taken' });
    expect(renamePath(site, 'css', 'a b')).toEqual({ error: 'invalidFolder' });
    expect(renamePath(site, 'css', 'a/b/c/d')).toEqual({ error: 'invalidFolder' });
    expect(renamePath(site, 'img/logo.png', 'img/a.png')).toEqual({ error: 'image' });
    expect(renamePath(site, 'img', 'pics')).toEqual({ error: 'image' });
    expect(renamePath(site, 'index.html', 'index.html')).toEqual({ site });
  });
});

describe('removePath', () => {
  it('deletes a file, or a folder with everything in it', () => {
    expect(paths(removePath(site, 'index.html'))).toEqual([
      'css/style.css',
      'css/print/a.css',
      'img/logo.png',
    ]);
    expect(paths(removePath(site, 'css'))).toEqual(['index.html', 'img/logo.png']);
    const out = removePath(site, 'js');
    expect('site' in out && out.site.folders).toEqual([]);
  });

  it("keeps the lesson's images", () => {
    expect(removePath(site, 'img/logo.png')).toEqual({ error: 'image' });
    expect(removePath(site, 'img')).toEqual({ error: 'image' });
  });
});
