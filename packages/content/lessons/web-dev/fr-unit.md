Three friends share a pizza. Nobody measures the slices in centimetres: each one gets a third, whatever the size of the pizza. A big pizza gives big slices, a small one small slices. A grid can share its width the same way.

## Columns in pixels don't share

Our columns from the last lesson have a fixed width:

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
    grid-template-columns: 100px 100px 100px;
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
</div>
```

On a wide screen, the apps stay small at the left, and the rest of the row is empty. On a narrow one, they stick out. 100 pixels is 100 pixels, whatever room there is.

## `fr`: a share of the room

`fr` means a **fraction**, a share. `1fr` is one share of the room left in the grid:

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
</div>
```

Three shares, so each column gets a third of the width. The grid takes away the gaps first, then cuts what's left into three equal parts. Make your preview's panel wider and narrower: the apps grow and shrink, and the row always ends at the right edge.

## Shares of different sizes

A column can get more shares than another. `2fr` is twice as much as `1fr`:

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
    grid-template-columns: 2fr 1fr 1fr;
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
</div>
```

Now there are four shares: the first column takes two of them, half of the width, and the other two columns take one each.

## Break it on purpose

Write the shares as percentages instead: `33% 33% 33%`. It looks almost right, but look at the right edge: the row sticks out a little. The three columns take 99% of the width, and the two gaps come on top of that. `fr` shares only the room the gaps leave, so it never sticks out.

---

## Mission: Cards that fill the row

Your cards have fixed widths. On a computer, there's an empty strip at the right of the cards. On a smaller window, the third column sticks out.

**Example**: the same six cards in three columns, but the first card now starts at the left edge of `.stats` and the third ends at its right edge, whatever the width of the window.

- The three columns share the whole width of `.stats`, the same for each one, on a computer and on a window 800 pixels wide.
- The cards keep at least 16 pixels between them, across and down.

Psst, a share is written `1fr`, one for each column :)
