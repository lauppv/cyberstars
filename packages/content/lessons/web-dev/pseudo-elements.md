On a shop's price tags, a little star shows before every special offer. Nobody types the star into each price: it's added by the tag's design. CSS can add a little something before or after an element too, without touching your HTML.

## `::before` and `::after`

A **pseudo-element** is a piece CSS adds to an element as if it were there. It's written with two colons:

```css preview
<style>
  /* show */
  .offer::before {
    content: "★ ";
  }
  /* /show */
</style>
<p class="offer">Two for one on Fridays</p>
<p>The shop opens at nine.</p>
```

```html preview
<p class="offer">Two for one on Fridays</p>
```

`::before` adds something at the very start, inside the element, before its own text. `::after` adds it at the very end.

`content` says what to add, in quotes. It's required: without `content`, nothing shows at all.

## Style it like an element

The added piece can have a style of its own:

```css preview
<style>
  /* show */
  .offer::before {
    content: "★ ";
    color: gold;
  }
  /* /show */
</style>
<p class="offer">Two for one on Fridays</p>
<p>The shop opens at nine.</p>
```

The star is gold, the rest of the text keeps its color.

## Only for decoration

The added text isn't in your HTML, and some screen readers skip it. So use it only for decoration: a little sign, an arrow, a quote mark. Anything people need to read goes in the HTML.

## Break it on purpose

Leave out `content`:

```css preview
<style>
  /* show */
  .offer::before {
    color: gold;
  }
  /* /show */
</style>
<p class="offer">Two for one on Fridays</p>
<p>The shop opens at nine.</p>
```

No star, and no error. A `::before` without `content` doesn't exist. Even an empty one needs `content: ""`.

---

## Mission: A plane on the board

The flight table's caption should look like the title of a departures board.

**Example**: the caption of the flight table shows a small plane sign before its words, like `✈ Departures today`.

- The flight table's caption has something added before it with `::before`, in its `content`.
- The caption's own words stay in the HTML, as they are.

Psst, no `content`, no `::before` :)
