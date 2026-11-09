At a wedding, the speech **right after** the bride's is often the best man's. Not any speech, the one that follows. CSS can pick an element by what comes right before it on the same level: its **sibling**.

Siblings are elements with the same parent, side by side in the HTML, like the headings and paragraphs of a page's `<body>`.

## `+`: the very next sibling

```css
h1 + p {
  font-size: 1.25rem;
}
```

"A `p` that comes **right after** an `h1`": the first paragraph under the page's title, often the introduction. Other paragraphs aren't touched, and a paragraph after an `h2` isn't either.

## `~`: any sibling after it

```css
h2 ~ p {
  color: gray;
}
```

"Every `p` that comes **after** an `h2`, on the same level", not just the first one. Paragraphs before the first `h2` stay as they were.

## Break it on purpose

Put something between them:

```html
<h1>Game Club</h1>
<img src="img/logo.svg" alt="The club's logo" />
<p>Welcome to the club!</p>
```

`h1 + p` no longer matches: the `p` comes right after the `img`, not the `h1`. `+` means **right** after, with nothing in between. `h1 ~ p` would still match it.

---

## Mission: The introduction

On every page of your site, the first paragraph under the biggest heading introduces the page. Make it look like an introduction.

**Example**: under Flight Schedule, the paragraph "Every departure from the station today." shows in italic, and so does the crew directory's first paragraph. The other paragraphs don't.

- The paragraph right after the biggest heading is in italic.
- The other paragraphs of the crew directory aren't.

Psst, `+` means right after :)
