Your file is getting longer. Soon you'll want to leave yourself a note in it, or switch off a part of the page for a while without losing it. You can do both with **comments**.

## Notes the browser skips

A comment starts with `<!--` and ends with `-->`. The browser skips everything between them, so it never shows on the page.

```html
<!-- Crates: the heaviest always at the bottom -->
<h2>Crates</h2>
<p>Forty crates, stacked by weight.</p>
```

A comment can be several lines long. People use comments for:

- notes to themselves or to their team: why something is done this way, what's left to do;
- marking where a long part of the page starts and ends;
- **commenting out**: putting a part of the page inside a comment, so it disappears from the page but stays in the file, ready to come back.

```html
<!--
<p>Loading starts at 06:00.</p>
-->
```

In the editor, **Ctrl+/** (**⌘+/** on a Mac) turns the lines you selected into a comment, or turns them back.

## Three things to watch

- **A comment ends at the first `-->`.** If you forget it, the comment goes on until the end of the file, and everything after it disappears from the page.
- **Comments can't go inside comments.** `<!-- a <!-- b --> c -->` ends at the first `-->`, and ` c -->` shows on the page as text.
- **Comments aren't secret.** The browser doesn't show them, but anyone can read them: right-click a page, pick **View page source**, and there they are. Never write a password, a key or anything private in a comment.

---

## Mission: Fee Under Review

The docking fee is changing, and nobody knows the new price yet.

- Take the fine print with the fee off the page. Keep it in your file, though: once the new price is known, it should come back with one small change.
- Above **Today on Board**, leave a note for the crew saying what that section holds. Visitors shouldn't see it.

Then check the preview: the fee is gone, and everything else is still there.
