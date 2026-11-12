Open a big box of crayons and read the names on them: "sky blue", "forest green", "brick red". Each name is one exact color. CSS has a box like that too, with about 140 named colors.

## Color names

You've already used a few: `steelblue`, `teal`, `firebrick`. Here are some more, from the same box:

```css preview
<style>
  /* show */
  h1 {
    color: navy;
  }

  h2 {
    color: darkolivegreen;
  }

  p {
    color: dimgray;
  }
  /* /show */
</style>
<h1>My Favourite Games</h1>
<h2>Board Games</h2>
<p>We keep them in the cupboard by the window.</p>
```

Names are easy to read in your CSS: you know what `tomato` or `gold` will look like before you even try. Most are made of everyday words, sometimes with `dark`, `light` or `medium` in front: `darkgreen`, `lightblue`, `mediumpurple`.

A few to try: `crimson`, `chocolate`, `darkcyan`, `darkslategray`, `indigo`, `maroon`, `olive`, `sienna`, `tomato`.

## Text that isn't quite black

Pure black text on a white page is very harsh. Many sites use a very dark grey or a very dark blue instead: it still reads easily, but feels softer. Try `darkslategray` on your paragraphs and compare.

## Break it on purpose

Spell a name wrong, or make one up:

```css preview
<style>
  /* show */
  p {
    color: darkgrey-blue;
  }
  /* /show */
</style>
<h1>My Favourite Games</h1>
<h2>Board Games</h2>
<p>We keep them in the cupboard by the window.</p>
```

There's no such color, so the browser ignores the whole declaration and the paragraphs stay black. No error appears: the color just doesn't change. A name must be one of the ones CSS knows, written as one word, with no spaces or `-`.

---

## Mission: Softer colors

Your page's paragraphs are still black, and so is The Greenhouse heading.

**Example**: the paragraphs show in a soft dark color like dark slate grey, and The Greenhouse in a color of its own.

- Paragraphs that aren't warnings have a color name of your own instead of black.
- The small headings that aren't shifts have a color of your own instead of black.

Psst, if a color does nothing, check its spelling: all one word :)
