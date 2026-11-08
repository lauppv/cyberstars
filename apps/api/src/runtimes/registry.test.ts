import { describe, it, expect } from 'vitest';
import { getRuntime, isEditorLanguage, languageOf } from './registry.js';

describe('languageOf', () => {
  it('runs an algorithm challenge in its set language', () => {
    expect(languageOf('algo-python')).toBe('python');
    expect(languageOf('algo-java')).toBe('java');
    expect(languageOf('algo-c')).toBe('c');
  });

  it('sends a web course to the web judge sandbox', () => {
    expect(languageOf('web-dev')).toBe('web');
    expect(getRuntime('web-dev')?.image).toBe('cyberstars-web-sandbox');
  });

  it('keeps a language as it is, in lower case', () => {
    expect(languageOf('java')).toBe('java');
    expect(languageOf('Python')).toBe('python');
  });
});

describe('getRuntime', () => {
  it('returns runtime for supported languages', () => {
    expect(getRuntime('python')).not.toBeNull();
    expect(getRuntime('c')).not.toBeNull();
    expect(getRuntime('java')).not.toBeNull();
  });

  it('returns runtime for algo variants', () => {
    expect(getRuntime('algo-python')).not.toBeNull();
    expect(getRuntime('algo-java')).not.toBeNull();
    expect(getRuntime('algo-c')).not.toBeNull();
  });

  it('is case-insensitive', () => {
    expect(getRuntime('Python')).not.toBeNull();
    expect(getRuntime('JAVA')).not.toBeNull();
  });

  it('returns null for unsupported language', () => {
    expect(getRuntime('ruby')).toBeNull();
    expect(getRuntime('')).toBeNull();
    expect(getRuntime('constructor')).toBeNull();
  });
});

describe('isEditorLanguage', () => {
  it('lets the editor run code in every language but the web judge sandbox', () => {
    expect(isEditorLanguage('python')).toBe(true);
    expect(isEditorLanguage('java')).toBe(true);
    expect(isEditorLanguage('c')).toBe(true);
    expect(isEditorLanguage('web')).toBe(false);
    expect(isEditorLanguage('ruby')).toBe(false);
  });
});
