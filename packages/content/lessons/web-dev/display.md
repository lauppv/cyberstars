You've seen two kinds of elements: blocks, which take a whole row, and inline ones, which sit inside a line. That's not fixed forever. With one property, you can change what kind of box an element is.

Think of tiles on a bathroom wall. Each tile is a little box with its own size, but they sit side by side in rows, and wrap to the next row when the wall ends. That's the third kind of box.

## `display`

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
  }

  .member {
    background-color: #1e3a5f;
    padding: 12px;
    margin: 4px;
  }

  /* show */
  .member {
    display: inline-block;
    width: 130px;
  }
  /* /show */
</style>
<div class="member">
  <h3>Sam Green</h3>
  <p>Plays chess on Sundays.</p>
</div>
<div class="member">
  <h3>Lea Park</h3>
  <p>Runs the card games, and keeps the score of every game.</p>
</div>
<div class="member">
  <h3>Ana Ruiz</h3>
  <p>New this year.</p>
</div>
```

The values you'll use:

- `block`: a row of its own, full width, like `<p>` or `<div>`;
- `inline`: inside the line, as wide as its words, like `<span>`. Width and height don't work on it;
- `inline-block`: sits in the line like a word, side by side with the others, **but** keeps its width, height, padding and margins, like a tile;
- `none`: not shown at all, and takes no room. The element is still in your HTML.

## Side by side

With `display: inline-block`, the member boxes line up in a row like tiles. When the row is full, the next one wraps onto a new row.

They line up along the bottom of their text by default, so boxes of different heights look uneven. `vertical-align: top` lines up their tops instead:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
  }

  .member {
    background-color: #1e3a5f;
    padding: 12px;
    margin: 4px;
  }

  /* show */
  .member {
    display: inline-block;
    vertical-align: top;
    width: 130px;
  }
  /* /show */
</style>
<div class="member">
  <h3>Sam Green</h3>
  <p>Plays chess on Sundays.</p>
</div>
<div class="member">
  <h3>Lea Park</h3>
  <p>Runs the card games, and keeps the score of every game.</p>
</div>
<div class="member">
  <h3>Ana Ruiz</h3>
  <p>New this year.</p>
</div>
```

## Break it on purpose

Make the member boxes `display: inline`. Their width is ignored, their padding spills over the lines around them, and they look like a mess of words. A box that should keep its size, but sit in a row, is `inline-block`.

Then try `display: none` on one: it disappears completely, and the others close up the gap.

---

## Mission: Cards in a row

On `crew.html`, your cards are stacked one under the other, each with lots of empty space on its right.

**Example**: on a wide screen, the cards sit side by side, in rows, their tops lined up.

- The first two cards stand side by side.
- Their tops are lined up.

Psst, a box that sits in a row but keeps its size is `inline-block` :)
