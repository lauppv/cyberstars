import { describe, expect, it } from 'vitest';
import { parsePreviewCell, shownPart, wholePage } from './previewCell';

const CSS_CELL = [
  '<p class="tip">Bring water.</p>',
  '<style>',
  '  /* show */',
  '  .tip {',
  '    color: red;',
  '  }',
  '  /* /show */',
  '</style>',
].join('\n');

describe('parsePreviewCell', () => {
  it('shows the marked part without its indent', () => {
    const cell = parsePreviewCell(CSS_CELL);
    expect(cell.hasRest).toBe(true);
    expect(cell.shown).toBe('.tip {\n  color: red;\n}');
    expect(cell.indent).toBe('  ');
    expect(cell.before).toBe('<p class="tip">Bring water.</p>\n<style>\n');
    expect(cell.after).toBe('\n</style>');
  });

  it('reads HTML markers', () => {
    const cell = parsePreviewCell('<!-- show -->\n<h1>Hi</h1>\n<!-- /show -->\n<p>rest</p>');
    expect(cell).toMatchObject({ before: '', shown: '<h1>Hi</h1>', after: '\n<p>rest</p>' });
  });

  it('shows everything when there are no markers, or only an opening one', () => {
    for (const source of ['<h1>Hi</h1>', '<!-- show -->\n<h1>Hi</h1>']) {
      expect(parsePreviewCell(source)).toEqual({
        before: '',
        shown: source,
        after: '',
        indent: '',
        hasRest: false,
      });
    }
  });

  it('keeps blank lines of the part blank', () => {
    const cell = parsePreviewCell(
      '<style>\n  /* show */\n  a {}\n\n  b {}\n  /* /show */\n</style>',
    );
    expect(cell.shown).toBe('a {}\n\nb {}');
  });
});

describe('wholePage and shownPart', () => {
  it('put the part back in place, markers gone', () => {
    const cell = parsePreviewCell(CSS_CELL);
    const page = wholePage(cell, '.tip {\n  color: blue;\n}');
    expect(page).toBe(
      '<p class="tip">Bring water.</p>\n<style>\n  .tip {\n    color: blue;\n  }\n</style>',
    );
    expect(shownPart(cell, page)).toBe('.tip {\n  color: blue;\n}');
  });

  it('read back an edit made inside the part in the whole page', () => {
    const cell = parsePreviewCell(CSS_CELL);
    const page = wholePage(cell, cell.shown).replace('color: red;', 'color: red;\n    margin: 0;');
    expect(shownPart(cell, page)).toBe('.tip {\n  color: red;\n  margin: 0;\n}');
  });

  it('give up once the edit reached outside the part', () => {
    const cell = parsePreviewCell(CSS_CELL);
    const page = wholePage(cell, cell.shown).replace('Bring water.', 'Bring juice.');
    expect(shownPart(cell, page)).toBeNull();
    expect(shownPart(cell, '')).toBeNull();
  });
});
