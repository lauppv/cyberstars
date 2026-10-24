// The code each language of a multi-language lesson was left with, for the
// visit. A draft written while that language's saved code couldn't load is
// marked, so once the saved code does load the student picks which one the
// editor keeps, instead of the draft hiding it and the next save replacing it.
export class CodeDrafts {
  private drafts = new Map<string, string>();
  private overUnknown = new Set<string>();

  // The student leaves `language` with `code`. Untouched starter code over
  // saved code that couldn't load isn't kept, so coming back loads the saved
  // code again.
  leave(language: string, code: string, starter: string, savedCodeUnknown: boolean) {
    if (savedCodeUnknown && code === starter) {
      this.drafts.delete(language);
      this.overUnknown.delete(language);
      return;
    }
    this.set(language, code);
    if (savedCodeUnknown) this.overUnknown.add(language);
  }

  // Code the student chose for `language`, such as an old attempt.
  set(language: string, code: string) {
    this.drafts.set(language, code);
    this.overUnknown.delete(language);
  }

  // What the editor opens on for `language`: its draft, else the saved code,
  // else the starter. `takeSaved` asks whether saved code that has loaded since
  // a marked draft was written takes the draft's place.
  open(
    language: string,
    saved: { code: string | null; failed: boolean },
    starter: string,
    takeSaved: () => boolean,
  ): string {
    const draft = this.drafts.get(language);
    if (draft === undefined) return saved.code ?? starter;
    if (!this.overUnknown.has(language) || saved.failed) return draft;
    this.overUnknown.delete(language);
    if (saved.code === null || saved.code === draft || !takeSaved()) return draft;
    this.drafts.delete(language);
    return saved.code;
  }

  clear() {
    this.drafts.clear();
    this.overUnknown.clear();
  }
}
