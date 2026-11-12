Imagine a book where a chapter title is printed smaller than the section titles inside it, and some chapters skip straight to tiny sub-sub-sections. You'd get lost. The size of a title is supposed to tell you how big a part it starts.

On a web page it's tempting to pick a heading by how it **looks**: "I want this a bit bigger, so `h2`". That's a trap. You pick a heading by what the part **means**. How big it looks is a job for CSS, which you'll learn soon.

## Two rules

**One `h1` per page.** The `h1` is the name of the whole page, like the title on a book's cover. A book has one cover.

**Never skip a level.** Under an `h2` comes an `h3`, not an `h4`. Going back up is fine: after an `h3` you can start a new `h2`.

This page follows both rules:

```html preview
<h1>My Favourite Games</h1>
<h2>Board Games</h2>
<h3>Chess</h3>
<h4>Openings</h4>
<h3>Monopoly</h3>
<h2>Video Games</h2>
```

As a table of contents:

```text
My Favourite Games
  Board Games
    Chess
      Openings
    Monopoly
  Video Games
```

Every step goes down by one level at most. Openings is an `h4` because it's a part of Chess.

## Why it matters

People who can't see the screen use a **screen reader**, a program that reads the page out loud. It can list the headings and jump between them, like a table of contents. Search engines read headings the same way to understand what a page is about. When the levels are right, the list makes sense. When they skip or repeat, it doesn't.

## Break it on purpose

Here are both mistakes:

```html preview
<h1>My Favourite Games</h1>
<h2>Board Games</h2>
<h4>Chess</h4>
<h1>Video Games</h1>
```

On the page you just see different sizes. But the outline is broken:

- Chess is an `h4` straight under an `h2`. Where is its `h3`?
- Video Games is a second `h1`, as if the page had two covers.

The fix: Chess becomes an `h3`, Video Games an `h2`.

---

## Mission: The right level

Your `index.html` has parts with `<h2>` and `<h3>` headings. Add a smaller part inside the first part, at the right level, and keep the whole outline right.

**Example**: read as a table of contents, your page would look something like this:

```text
Welcome aboard
  About the Station
    The Greenhouse
  Today on Board
    Morning Shift
    Night Shift
```

- Your first `<h2>` part has a smaller part inside it, with its heading at the next level down and a paragraph under it.
- The page has exactly one `<h1>`.
- No heading skips a level.

Psst, a part inside an `h2` starts with an `h3`, however big or small you'd like it to look :)
