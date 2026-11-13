Turn on the light in a cinema after the film: it doesn't jump from dark to bright, it comes up slowly, so your eyes have time. A change that takes a moment feels softer than one that happens at once. CSS can let a change take its time too.

## A change at once

A `:hover` rule changes a style the moment the mouse arrives:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  /* show */
  .tile {
    background-color: #1e3a5f;
    padding: 24px;
  }

  .tile:hover {
    background-color: #e63946;
  }
  /* /show */
</style>
<p class="tile">Point at me</p>
```

Move the mouse over the tile: it turns red at once, and back at once when you leave.

## `transition`

`transition` says which property changes slowly, and how long the change takes, in seconds (`s`):

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  /* show */
  .tile {
    background-color: #1e3a5f;
    padding: 24px;
    transition: background-color 0.5s;
  }

  .tile:hover {
    background-color: #e63946;
  }
  /* /show */
</style>
<p class="tile">Point at me</p>
```

Now the red comes in over half a second, and goes back the same way when the mouse leaves. The browser works out every color in between.

Two things to remember:

- The `transition` goes on the element itself, `.tile`, not on `:hover`. Then it counts both ways: in and out.
- `all` instead of a property slows down every change: `transition: all 0.5s`. Naming the property is clearer, and you can name several with commas: `transition: background-color 0.5s, color 0.5s`.

A good transition is short: between 0.2 and 0.5 seconds. Longer, and the page feels slow.

## Not everything can change slowly

A color, a size or a distance has values in between, so it can change slowly. `display` has none: an element is shown or it isn't. A border that **appears** from nothing has no in-between either. To make a border come in slowly, give the element a border from the start, `transparent`, and change only its color on hover.

## Break it on purpose

Put the `transition` in the `:hover` rule instead. Move the mouse in: the red comes slowly. Move it out: it jumps back at once. When the mouse leaves, the `:hover` rule, and its `transition`, don't count any more.

---

## Mission: Cards that light up

On the dashboard, a card should show which one the mouse is on, with a border in the site's accent color that comes in softly.

**Example**: move the mouse over a card: a yellow border comes in around it, not all at once. Move it away, and the border fades out. In the light theme, the border is the light theme's accent color.

- Under the mouse, every card of the dashboard gets a border of at least 2 pixels in the accent color, `--accent`. Without the mouse, no border shows.
- The border comes in and goes out slowly, not at once.
- The cards don't move or grow when the border shows.

Psst, a border that is `transparent` from the start is already there, and takes its room :)
