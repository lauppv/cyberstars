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
