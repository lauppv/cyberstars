Write a page of notes with the lines squashed together and it's hard to read back: your eyes keep jumping to the wrong line. Leave a bit of space between the lines and it reads easily. Space between letters matters too: think of a shop sign with its letters spread wide.

## `line-height`: room between lines

`line-height` sets how tall each line of text is, which leaves room above and below the letters:

```css preview
<style>
  /* show */
  p {
    line-height: 1.6;
  }
  /* /show */
</style>
<h2>Board Games</h2>
<p>We keep the board games in the cupboard by the window. Chess, Monopoly and cards are on the top shelf, and the puzzles sit under them, next to the spare dice.</p>
```

`1.6` means "each line is 1.6 times as tall as the text's size". With text 16 pixels tall, each line is 16 × 1.6, about 26 pixels. Long paragraphs read much more easily with a line height of about 1.5 to 1.7.

A plain number like `1.6` is the best way to write it: if you make the text bigger later, the lines grow with it.

## `letter-spacing`: room between letters

`letter-spacing` adds space between the letters of each word:

```css preview
<style>
  /* show */
  h2 {
    letter-spacing: 2px;
  }
  /* /show */
</style>
<h2>Board Games</h2>
<p>We keep the board games in the cupboard by the window. Chess, Monopoly and cards are on the top shelf, and the puzzles sit under them, next to the spare dice.</p>
```

`2px` adds 2 pixels after every letter. It suits short things, like headings in capitals or labels. On a whole paragraph it makes words hard to read.

## Break it on purpose

Squeeze the lines:

```css preview
<style>
  /* show */
  p {
    line-height: 0.8;
  }
  /* /show */
</style>
<h2>Board Games</h2>
<p>We keep the board games in the cupboard by the window. Chess, Monopoly and cards are on the top shelf, and the puzzles sit under them, next to the spare dice.</p>
```

The lines now overlap: the bottom of one touches the top of the next. Go the other way, `line-height: 4`, and each line floats alone. Somewhere around 1.5 is just right.

---

## Mission: Room to breathe

The paragraphs on your page feel crowded, and the part headings could look more like signs.

**Example**: the paragraphs have more room between their lines, and the letters of the part headings are spread out a little.

- Every paragraph's lines are at least 1.5 times as tall as its text (24 pixels for 16-pixel text).
- The part headings have at least 1 pixel of space between their letters.

Psst, a plain number with no unit is the best way to write a line height :)
