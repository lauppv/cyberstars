import { describe, it, expect } from 'vitest';
import { webFailureText, type WebFailure } from './webTests.js';

const say = (f: WebFailure, lang: 'en' | 'ro' = 'en') => webFailureText(f, lang);

describe('webFailureText', () => {
  it('says what was expected and what the page had, for each check', () => {
    expect(say({ kind: 'missing', label: 'an <h1>' })).toBe('Expected an <h1>, found none.');
    expect(
      say({
        kind: 'text',
        label: 'an <h1>',
        detail: 'equals',
        expected: 'Station Log',
        found: 'Log',
      }),
    ).toBe('Expected an <h1> with the text “Station Log”, found “Log”.');
    expect(
      say({ kind: 'text', label: 'the note', detail: 'contains', expected: 'orbit', found: 'x' }),
    ).toBe('Expected the note with “orbit” in its text, found “x”.');
    expect(say({ kind: 'text', label: 'the note', detail: 'nonEmpty', found: '' })).toBe(
      'Expected the note with some text, found it empty.',
    );
    expect(
      say({ kind: 'attr', label: 'the <html> tag', detail: 'lang', expected: 'en', found: null }),
    ).toBe('Expected the <html> tag with lang="en", found no lang.');
    expect(
      say({ kind: 'attr', label: 'the picture', detail: 'alt', expected: '', found: null }),
    ).toBe('Expected the picture with alt, found no alt.');
    expect(
      say({ kind: 'style', label: 'the bar', detail: 'display', expected: 'flex', found: 'block' }),
    ).toBe('Expected the bar with display: flex, found display: block.');
    expect(
      say({ kind: 'count', label: 'crew cards', detail: 'equals', expected: '3', found: '2' }),
    ).toBe('Expected crew cards: 3, found 2.');
    expect(
      say({ kind: 'count', label: 'crew cards', detail: 'atLeast', expected: '3', found: '2' }),
    ).toBe('Expected crew cards: at least 3, found 2.');
    expect(
      say({ kind: 'layout', label: 'the cards', expected: 'row', found: 'column', width: 1280 }),
    ).toBe(
      'Expected the cards side by side in a window 1280px wide, found them one under the other.',
    );
    expect(
      say({ kind: 'layout', label: 'the cards', expected: 'column', found: 'one', width: 375 }),
    ).toBe('Expected the cards one under the other in a window 375px wide, found only one.');
    expect(
      say({
        kind: 'size',
        label: 'a card',
        detail: 'maxWidth',
        expected: '300',
        found: '420',
        width: 1280,
      }),
    ).toBe('Expected a card at most 300px wide in a window 1280px wide, found it 420px wide.');
    expect(say({ kind: 'fits', found: '900', width: 375 })).toBe(
      'Expected the page to fit 375px without scrolling sideways, found it 900px wide.',
    );
    expect(say({ kind: 'loaded', label: 'the station picture' })).toBe(
      'Expected the station picture to show, found its file missing: check its path.',
    );
    expect(say({ kind: 'alerted', expected: 'Hi crew', found: null })).toBe(
      'Expected a message box saying “Hi crew”, found none.',
    );
    expect(say({ kind: 'doctype' })).toBe(
      'Expected the page to start with <!DOCTYPE html>, found it missing.',
    );
    expect(say({ kind: 'logged', expected: 'ready', found: null })).toBe(
      'Expected the console to show “ready”, found nothing.',
    );
    expect(say({ kind: 'errors', found: 'x is not defined' })).toBe(
      'Expected the page to run without errors, found: x is not defined',
    );
    expect(say({ kind: 'at', expected: 'crew.html', found: 'index.html' })).toBe(
      'Expected to end up on crew.html, found index.html.',
    );
    expect(say({ kind: 'memory' })).toBe('The page used too much memory and was stopped.');
  });

  it('says how an effect missed: a bound, a contrast, a look, room, the middle, the outline', () => {
    expect(
      say({
        kind: 'style',
        label: 'a card',
        detail: 'padding-top',
        compare: 'atLeast',
        expected: '8',
        found: '0px',
      }),
    ).toBe('Expected a card with padding-top of at least 8px, found padding-top: 0px.');
    expect(
      say({
        kind: 'style',
        label: 'a card',
        detail: 'border-top-style',
        compare: 'not',
        expected: 'none',
        found: 'none',
      }),
    ).toBe('Expected a card with border-top-style other than none, found border-top-style: none.');
    expect(
      say({
        kind: 'style',
        label: 'a card',
        detail: 'background-color',
        compare: 'not',
        expected: 'rgba(0, 0, 0, 0)',
        found: 'rgba(0, 0, 0, 0)',
      }),
    ).toBe(
      'Expected a card with background-color other than transparent, found background-color: transparent.',
    );
    expect(
      say({
        kind: 'style',
        label: 'a heading',
        detail: 'color',
        compare: 'not',
        expected: 'rgb(0, 0, 0)',
        found: 'rgb(0, 0, 0)',
      }),
    ).toBe('Expected a heading with color other than black, found color: black.');
    expect(
      say({
        kind: 'style',
        label: 'the page',
        detail: 'font-family',
        compare: 'endsWith',
        expected: 'sans-serif',
        found: 'Verdana',
      }),
    ).toBe('Expected the page with font-family ending in sans-serif, found font-family: Verdana.');
    expect(say({ kind: 'contrast', label: 'a warning', expected: '4.5', found: '2.38' })).toBe(
      'Expected a warning readable on its background, a contrast of at least 4.5:1, found 2.38:1.',
    );
    expect(
      say({
        kind: 'differs',
        label: 'the warnings',
        other: 'the other paragraphs',
        detail: 'color, font-weight',
      }),
    ).toBe(
      'Expected the warnings to look unlike the other paragraphs (by color, font-weight), found one that looks the same.',
    );
    expect(say({ kind: 'gap', label: 'the cards', expected: '12', found: '0', width: 1280 })).toBe(
      'Expected the cards at least 12px apart in a window 1280px wide, found two only 0px apart.',
    );
    expect(
      say({ kind: 'align', label: 'the cards', expected: 'row', found: '30', width: 1280 }),
    ).toBe(
      'Expected the cards lined up at their tops in a window 1280px wide, found them 30px apart.',
    );
    expect(say({ kind: 'centered', label: 'the column', found: '0 304', width: 1280 })).toBe(
      'Expected the column centered in its parent in a window 1280px wide, found 0px of room on the left and 304px on the right.',
    );
    expect(say({ kind: 'centered', label: 'the column', detail: 'full', width: 375 })).toBe(
      'Expected the column centered in its parent in a window 375px wide, found it as wide as its parent.',
    );
    expect(
      say({ kind: 'fills', label: 'the table', expected: '928', found: '410', width: 1280 }),
    ).toBe(
      'Expected the table as wide as its parent (928px) in a window 1280px wide, found it 410px wide.',
    );
    expect(say({ kind: 'outline', detail: 'h1', found: '2' })).toBe(
      'Expected the page to have one biggest heading (h1), found 2.',
    );
    expect(
      say({ kind: 'outline', detail: 'skip', expected: 'h2', other: 'h4', found: 'Night Shift' }),
    ).toBe(
      'Expected headings that never skip a level, found an h4 right after an h2: “Night Shift”.',
    );
    expect(say({ kind: 'contrast', label: 'the page', detail: 'on', expected: 'dark' })).toBe(
      'Expected the page light on a dark background, found it the other way round.',
    );
    expect(
      say({ kind: 'contrast', label: 'un avertisment', expected: '4.5', found: '2.38' }, 'ro'),
    ).toBe(
      'Se aștepta ca un avertisment să se citească pe fundalul său, cu un contrast de cel puțin 4.5:1, dar contrastul e 2.38:1.',
    );
    expect(say({ kind: 'contrast', label: 'a warning', found: '2.38', hidden: true })).toBe(
      'A warning: not what the mission asks. The page has “2.38”.',
    );
  });

  it('on a hidden case says only what the page had', () => {
    expect(
      say({ kind: 'text', label: 'a crew member', detail: 'equals', found: 'Ada', hidden: true }),
    ).toBe('A crew member: not what the mission asks. The page has “Ada”.');
    expect(say({ kind: 'logged', found: null, hidden: true })).toBe(
      'The page: not what the mission asks.',
    );
    // An element that isn't there gives nothing away
    expect(say({ kind: 'missing', label: 'a crew list', hidden: true })).toBe(
      'Expected a crew list, found none.',
    );
  });

  it('speaks Romanian, with its quotes', () => {
    expect(
      say(
        { kind: 'text', label: 'titlul', detail: 'equals', expected: 'Jurnal', found: 'Log' },
        'ro',
      ),
    ).toBe('Se aștepta titlul cu textul „Jurnal”, dar are „Log”.');
    expect(say({ kind: 'missing', label: 'un <h1>' }, 'ro')).toBe(
      'Se aștepta un <h1>, dar pagina nu are.',
    );
    expect(say({ kind: 'memory' }, 'ro')).toBe(
      'Pagina a folosit prea multă memorie și a fost oprită.',
    );
  });

  it('cuts a long text from the page', () => {
    const text = say({
      kind: 'text',
      label: 'the note',
      detail: 'equals',
      expected: 'a',
      found: 'x'.repeat(200),
    });
    expect(text).toContain(`“${'x'.repeat(77)}...”`);
  });
});
