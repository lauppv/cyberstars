On many phones, the weather on the home screen isn't a small icon like the apps. It's a wider box, as wide as two apps side by side, and the apps make room for it. A grid item can do the same: take two columns instead of one.

## `grid-column: span 2`

`grid-column` says which columns an item takes. `span 2` means: two columns, side by side, starting where the item would start anyway:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .app {
    background-color: #1e3a5f;
    padding: 8px;
    margin: 0;
    text-align: center;
  }

  .apps {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }

  /* show */
  .weather {
    grid-column: span 2;
  }
  /* /show */
</style>
<div class="apps">
  <p class="app weather">Weather: 18 °C</p>
  <p class="app">Camera</p>
  <p class="app">Music</p>
  <p class="app">Maps</p>
  <p class="app">Clock</p>
</div>
```

The weather takes the first two columns of the first row, and the gap between them too. Camera gets the third column. The other apps go on after it, one cell each, as before.

The span doesn't change the columns: there are still three. Only the weather covers more than one.

## A span that doesn't fit

Move the weather one place down, after Camera and Music. It still wants two columns, but only one is left in the first row:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .app {
    background-color: #1e3a5f;
    padding: 8px;
    margin: 0;
    text-align: center;
  }

  .apps {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }

  /* show */
  .weather {
    grid-column: span 2;
  }
  /* /show */
</style>
<div class="apps">
  <p class="app">Camera</p>
  <p class="app">Music</p>
  <p class="app weather">Weather: 18 °C</p>
  <p class="app">Maps</p>
  <p class="app">Clock</p>
</div>
```

The weather goes to the start of the next row, where two columns are free. The cell it couldn't use stays empty: a hole at the end of the first row. Where a wide item sits in the HTML matters.

## Break it on purpose

Write `span 5` on the weather, in a grid of three columns. The grid doesn't cut the item down. It adds two more columns at the right for it, and the row sticks out of its box. A span is never more than the columns you have.

---

## Mission: The big news

The next launch is the news everybody asks about. Its card should be the widest one on the dashboard.

**Example**: in the second row, the Next launch card is twice as wide as the others, and the next card stands beside it:

```text
Crew on board    Oxygen         Water
Next launch (twice as wide)     Power
Days in orbit
```

- The Next launch card gets the id `next-launch`. Later lessons use it.
- On a computer and in a window 800 pixels wide, it's as wide as two columns with the gap between them, and the next card stands beside it.
- The other cards keep one column each.

Psst, the span goes on the one card, not on all of them :)
