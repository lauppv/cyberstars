Think of a bookshelf. The top shelf is tall, for the big picture books. The shelves under it are lower, for the small ones. You decide how tall each shelf is. In a grid, the rows are the shelves.

## Rows as tall as their content

So far we only wrote columns. Each row was as tall as the tallest item in it:

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

  /* show */
  .apps {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }
  /* /show */
</style>
<div class="apps">
  <p class="app">Camera</p>
  <p class="app">Music</p>
  <p class="app">Maps</p>
  <p class="app">Clock</p>
  <p class="app">Notes</p>
  <p class="app">Games</p>
  <p class="app">Weather</p>
</div>
```

Every row is just tall enough for one line of text.

## `grid-template-rows`

`grid-template-rows` gives the rows their heights, like `grid-template-columns` gives the columns their widths. One height for each row, starting at the top:

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

  /* show */
  .apps {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 80px 40px;
    gap: 12px;
  }
  /* /show */
</style>
<div class="apps">
  <p class="app">Camera</p>
  <p class="app">Music</p>
  <p class="app">Maps</p>
  <p class="app">Clock</p>
  <p class="app">Notes</p>
  <p class="app">Games</p>
  <p class="app">Weather</p>
</div>
```

The first row is 80 pixels tall, the second 40. The items grow to fill their row: the apps of the first row are taller boxes now.

But look at Weather. We wrote two heights, and the seventh app needs a third row. The grid makes that row by itself, and a row the grid makes by itself is as tall as its content again.

## `grid-auto-rows`

`grid-auto-rows` is the height of the rows the grid makes by itself, every one of them:

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

  /* show */
  .apps {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 80px;
    grid-auto-rows: 40px;
    gap: 12px;
  }
  /* /show */
</style>
<div class="apps">
  <p class="app">Camera</p>
  <p class="app">Music</p>
  <p class="app">Maps</p>
  <p class="app">Clock</p>
  <p class="app">Notes</p>
  <p class="app">Games</p>
  <p class="app">Weather</p>
</div>
```

Now we wrote only the first row. Every row after it is one the grid makes, and each one is 40 pixels tall. Add more apps: every new row is 40 pixels too.

## Break it on purpose

Write a height that's too small, `grid-auto-rows: 10px`. The rows get only 10 pixels, but the words still need their room. The text comes out of its box and falls over the next row. A row in pixels doesn't grow for its content, so give it enough.

---

## Mission: A taller first row

The first row of the dashboard holds the most important numbers. The crew wants it to stand out.

**Example**: the three cards of the first row are taller than the others. Every row after it has the same, smaller height, also when more cards come.

- The cards of the first row are 200 pixels tall.
- Every other row is 150 pixels tall, also a row the grid makes for more cards.
- It stays like that on a computer and in a window 800 pixels wide.

Psst, one property is for the rows you write, the other for the rows the grid makes :)
