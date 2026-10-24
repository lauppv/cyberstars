import { describe, it, expect, vi } from 'vitest';
import { CodeDrafts } from './codeDrafts';

const STARTER = 'def solve():\n    pass';
const loaded = (code: string | null) => ({ code, failed: false });
const failed = { code: null, failed: true };

describe('CodeDrafts', () => {
  it('opens the saved code, else the starter, when nothing was left', () => {
    const drafts = new CodeDrafts();
    expect(drafts.open('python', loaded('saved'), STARTER, () => true)).toBe('saved');
    expect(drafts.open('python', loaded(null), STARTER, () => true)).toBe(STARTER);
  });

  it('opens the draft a language was left with, over its saved code', () => {
    const drafts = new CodeDrafts();
    const takeSaved = vi.fn(() => true);
    drafts.leave('python', 'mine', STARTER, false);
    expect(drafts.open('python', loaded('saved'), STARTER, takeSaved)).toBe('mine');
    expect(takeSaved).not.toHaveBeenCalled();
  });

  it('keeps an untouched starter as a draft while the saved code is known', () => {
    const drafts = new CodeDrafts();
    drafts.leave('python', STARTER, STARTER, false);
    expect(drafts.open('python', loaded('saved'), STARTER, () => true)).toBe(STARTER);
  });

  it("doesn't keep an untouched starter over saved code that couldn't load", () => {
    const drafts = new CodeDrafts();
    drafts.leave('python', 'older', STARTER, false);
    drafts.leave('python', STARTER, STARTER, true);
    expect(drafts.open('python', loaded('saved'), STARTER, () => true)).toBe('saved');
  });

  describe('a draft written while the saved code could not load', () => {
    it('lets the student take the saved code once it loads', () => {
      const drafts = new CodeDrafts();
      drafts.leave('python', 'mine', STARTER, true);
      expect(drafts.open('python', loaded('saved'), STARTER, () => true)).toBe('saved');
      // asked once: the draft is gone
      expect(drafts.open('python', loaded('saved'), STARTER, () => true)).toBe('saved');
    });

    it('keeps the draft when the student says no, and asks only once', () => {
      const drafts = new CodeDrafts();
      const takeSaved = vi.fn(() => false);
      drafts.leave('python', 'mine', STARTER, true);
      expect(drafts.open('python', loaded('saved'), STARTER, takeSaved)).toBe('mine');
      expect(drafts.open('python', loaded('saved'), STARTER, takeSaved)).toBe('mine');
      expect(takeSaved).toHaveBeenCalledTimes(1);
    });

    it('opens the draft without asking while the saved code still fails to load', () => {
      const drafts = new CodeDrafts();
      const takeSaved = vi.fn(() => true);
      drafts.leave('python', 'mine', STARTER, true);
      expect(drafts.open('python', failed, STARTER, takeSaved)).toBe('mine');
      expect(takeSaved).not.toHaveBeenCalled();
      // still marked: asked once it loads
      expect(drafts.open('python', loaded('saved'), STARTER, takeSaved)).toBe('saved');
    });

    it("doesn't ask when nothing was saved or the saved code is the draft", () => {
      const drafts = new CodeDrafts();
      const takeSaved = vi.fn(() => true);
      drafts.leave('python', 'mine', STARTER, true);
      expect(drafts.open('python', loaded(null), STARTER, takeSaved)).toBe('mine');
      drafts.leave('java', 'same', STARTER, true);
      expect(drafts.open('java', loaded('same'), STARTER, takeSaved)).toBe('same');
      expect(takeSaved).not.toHaveBeenCalled();
    });

    it('is no longer marked once the language is left again with its code known', () => {
      const drafts = new CodeDrafts();
      const takeSaved = vi.fn(() => true);
      drafts.leave('python', 'mine', STARTER, true);
      drafts.leave('python', 'mine', STARTER, false);
      expect(drafts.open('python', loaded('saved'), STARTER, takeSaved)).toBe('mine');
      expect(takeSaved).not.toHaveBeenCalled();
    });

    it('is no longer marked once the student picks code for it', () => {
      const drafts = new CodeDrafts();
      const takeSaved = vi.fn(() => true);
      drafts.leave('python', 'mine', STARTER, true);
      drafts.set('python', 'attempt');
      expect(drafts.open('python', loaded('saved'), STARTER, takeSaved)).toBe('attempt');
      expect(takeSaved).not.toHaveBeenCalled();
    });
  });

  it('forgets everything on clear', () => {
    const drafts = new CodeDrafts();
    drafts.leave('python', 'mine', STARTER, true);
    drafts.clear();
    expect(drafts.open('python', loaded('saved'), STARTER, () => true)).toBe('saved');
  });
});
