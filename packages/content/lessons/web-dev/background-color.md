Many phone apps have a dark mode: white text on a dark background, easier on the eyes at night. Your station's page is all about space, so a night sky behind it would suit it. For that, we need to color what's **behind** the text, not the text itself.

## `background-color`

`color` colors the text. `background-color` colors the space behind it:

```css preview
<style>
  /* show */
  .tip {
    background-color: lightyellow;
  }
  /* /show */
</style>
<p>Practice starts at five.</p>
<p class="tip">Bring water to every game.</p>
```

A paragraph is a block, so its background is a strip as wide as the page, behind its text.

It takes the same kinds of values as `color`: names, hex codes, `rgb()`, with or without alpha.

## The whole page

To color the whole page, give the background to the `body`, which holds everything you see:

```css preview
<style>
  /* show */
  body {
    background-color: #0b1d3a;
  }
  /* /show */
</style>
<h1>Night Owls</h1>
<p>We play every Friday night.</p>
```

The whole page turns night blue.

## Text and background go together

A dark background needs light text, and a light background dark text. Change one, and check the other:

```css preview
<style>
  /* show */
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
  }
  /* /show */
</style>
<h1>Night Owls</h1>
<p>We play every Friday night.</p>
```

A `color` on the `body` is taken by everything inside it that has no color of its own: paragraphs, lists, table cells. You'll see exactly why in a later lesson. An element with a rule of its own, like your paragraphs, keeps that rule's color, so check those too.

## Break it on purpose

Give the body the dark background and leave the text as it was:

```css preview
<style>
  p {
    color: #333333;
  }
  /* show */
  body {
    background-color: #0b1d3a;
  }
  /* /show */
</style>
<h1>Night Owls</h1>
<p>We play every Friday night.</p>
```

Your dark grey paragraphs on night blue are almost invisible. The text didn't change, the page just stopped being readable. Every time you change a background, look at the text on it.

---

## Mission: Night mode

The station's designer has a night palette: night blue, `#0b1d3a`, for the page, and a very light blue-white, `#f0f4ff`, for its text.

**Example**: the whole page is night blue, the paragraphs are almost white, and the two warnings stand on a strip of their own color. Some headings and links may be hard to read for now. You'll fix them in the next lesson.

- The page's background is `#0b1d3a`.
- The page's text, given on the `body`, is `#f0f4ff`.
- Paragraphs that aren't warnings or the address are `#f0f4ff` too.
- The warnings have a background the other paragraphs don't have.

Psst, the page's background goes on the `body` :)
