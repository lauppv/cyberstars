At a wedding, the speech **right after** the bride's is often the best man's. Not any speech, the one that follows. CSS can pick an element by what comes right before it on the same level: its **sibling**.

Siblings are elements with the same parent, side by side in the HTML, like the headings and paragraphs of a page's `<body>`.

## `+`: the very next sibling

```css preview
<style>
  /* show */
  h1 + p {
    font-size: 1.25rem;
  }
  /* /show */
</style>
<h1>Game Club</h1>
<p>Welcome to the club! We play every week.</p>
<p>New members are always welcome.</p>
<h2>Our Games</h2>
<p>Chess and cards.</p>
<p>Puzzles on rainy days.</p>
```

"A `p` that comes **right after** an `h1`": the first paragraph under the page's title, often the introduction. Other paragraphs aren't touched, and a paragraph after an `h2` isn't either.

## `~`: any sibling after it

```css preview
<style>
  /* show */
  h2 ~ p {
    color: gray;
  }
  /* /show */
</style>
<h1>Game Club</h1>
<p>Welcome to the club! We play every week.</p>
<p>New members are always welcome.</p>
<h2>Our Games</h2>
<p>Chess and cards.</p>
<p>Puzzles on rainy days.</p>
```

"Every `p` that comes **after** an `h2`, on the same level", not just the first one. Paragraphs before the first `h2` stay as they were.

## Break it on purpose

Put something between them:

```html preview
<style>
  h1 + p {
    font-size: 1.25rem;
  }
</style>
<!-- show -->
<h1>Game Club</h1>
<img src="img/station.svg" alt="The space station" />
<p>Welcome to the club!</p>
<!-- /show -->
```

`h1 + p` no longer matches: the `p` comes right after the `img`, not the `h1`. `+` means **right** after, with nothing in between. `h1 ~ p` would still match it.

---

## Mission: The introduction

On every page of your site, the first paragraph under the biggest heading introduces the page. Make it look like an introduction.

**Example**: under Flight Schedule, the paragraph "Every departure from the station today." shows in italic, and so does the crew directory's first paragraph. The other paragraphs don't.

- The paragraph right after the biggest heading is in italic.
- The other paragraphs of the crew directory aren't.

Psst, `+` means right after :)
