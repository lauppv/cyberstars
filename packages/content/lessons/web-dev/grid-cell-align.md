Put a small cup on a big tray. You can push it to a corner, or put it in the middle. The tray doesn't change: only where the cup sits on it. A grid's cell is the tray, and its item is the cup.

## Items fill their cells

By default, a grid item is as wide and as tall as its cell. You see it when an item has a background:

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
  }

  /* show */
  .apps {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 80px;
    gap: 12px;
  }
  /* /show */
</style>
<div class="apps">
  <p class="app">Camera</p>
  <p class="app">Music</p>
  <p class="app">Maps</p>
</div>
```

Each app fills its whole cell, 80 pixels tall, and its word sits at the top left.

## `justify-items`: across

`justify-items` says where every item sits across its cell, from left to right: `start`, `center` or `end`. An item that doesn't fill the cell any more is only as wide as its content:

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
  }

  /* show */
  .apps {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 80px;
    gap: 12px;
    justify-items: center;
  }
  /* /show */
</style>
<div class="apps">
  <p class="app">Camera</p>
  <p class="app">Music</p>
  <p class="app">Maps</p>
</div>
```

Each app is now a small box in the middle of its cell, across. It still takes the whole height.

## `align-items`: up and down

`align-items` does the same from top to bottom. You know it from flex, and in a grid it moves each item inside its own cell:

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
  }

  /* show */
  .apps {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 80px;
    gap: 12px;
    justify-items: center;
    align-items: center;
  }
  /* /show */
</style>
<div class="apps">
  <p class="app">Camera</p>
  <p class="app">Music</p>
  <p class="app">Maps</p>
</div>
```

Now each app sits in the very middle of its cell. Try `end` for both: every app goes to the bottom right corner of its cell.

## A card can be a grid too

A grid item can be a grid of its own. Then `justify-items` on the item places **its** children, inside it. That's how we'll put the heading and the number in the middle of each card.

## Break it on purpose

Use `text-align: center` on an app instead. The word moves to the middle, but the box still fills the whole cell. `text-align` moves the text inside its box. `justify-items` moves the box itself.

---

## Mission: Numbers in the middle

The cards' headings and numbers sit at the left. On a tall card, like the crew's, there's a lot of empty room under them.

**Example**: in every card, the heading and the number stand in the middle across, each one only as wide as its text.

- In every card, the heading and the number stand in the middle across, on a computer and in a window 800 pixels wide.
- The grid of cards stays as it is: the crew's card over two rows, the Next launch card over two columns.

Psst, the cards place their own heading and number, so the cards become grids :)
