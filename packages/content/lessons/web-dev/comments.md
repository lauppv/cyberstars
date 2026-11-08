Your file is growing. Soon you'll want to leave yourself a note in it, or switch a part of the page off for a while without losing it. Both are done with **comments**.

## Notes the browser skips

A comment starts with `<!--` and ends with `-->`. The browser skips everything between them: it never shows on the page.

```html
<!-- Crates: the heaviest always at the bottom -->
<h2>Crates</h2>
<p>Forty crates, stacked by weight.</p>
```

A comment can run over several lines. People use them for:

- notes to themselves or to their team: why something is the way it is, what's left to do;
- marking where a long part of the page starts and ends;
- **commenting out**: wrapping a part of the page in a comment, so it disappears from the page but stays in the file, ready to come back.

```html
<!--
<p>Loading starts at 06:00.</p>
-->
```

In the editor, **Ctrl+/** (**⌘+/** on a Mac) wraps the lines you selected in a comment, or takes the comment away again.

## Three things to watch

- **A comment ends at the first `-->`.** Forget it and the comment runs to the end of the file: everything after it disappears from the page.
- **Comments don't nest.** `<!-- a <!-- b --> c -->` ends at the first `-->`, and ` c -->` shows on the page as text.
- **Comments aren't secret.** The browser doesn't show them, but anyone can read them: right-click a page, pick **View page source**, and there they are. Never write a password, a key or anything private in a comment.

---

## Mission: Fee Under Review

The docking fee is being changed, and nobody knows the new one yet.

- Comment out the fine print with the fee, so it stays in your file but no longer shows on the page.
- Above **Today on Board**, write a comment for the crew saying what that section holds.

Then check the preview: the fee is gone, and everything after it is still there.
