Look at a school timetable. Most lessons take one box, but a double art lesson takes two, from the line at 9 o'clock to the line at 11. You don't count boxes: you say between which lines it goes. A grid has lines like that too.

## The lines of a grid

A grid's columns stand between lines. Three columns have four lines, numbered from the left: line 1 is the left edge, line 4 the right edge, and lines 2 and 3 are between the columns. The rows have lines too, numbered from the top.

```text
line 1      line 2      line 3      line 4
  |  column 1  |  column 2  |  column 3  |
```

## `grid-column: 1 / 3`

`grid-column` can name two lines: where the item starts, a `/`, and where it ends. `grid-row` does the same for the rows:

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
  .music {
    grid-column: 3 / 4;
    grid-row: 1 / 3;
  }
  /* /show */
</style>
<div class="apps">
  <p class="app">Camera</p>
  <p class="app">Maps</p>
  <p class="app music">Music: now playing</p>
  <p class="app">Clock</p>
  <p class="app">Notes</p>
</div>
```

Music goes from column line 3 to line 4: the third column. And from row line 1 to line 3: the first two rows. It's a tall box on the right, and the other apps fill the cells left.

## Lines don't care about the HTML

Move Music to the start of the HTML, before Camera:

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
  .music {
    grid-column: 3 / 4;
    grid-row: 1 / 3;
  }
  /* /show */
</style>
<div class="apps">
  <p class="app music">Music: now playing</p>
  <p class="app">Camera</p>
  <p class="app">Maps</p>
  <p class="app">Clock</p>
  <p class="app">Notes</p>
</div>
```

Nothing moves on the page. An item placed by its lines goes between those lines, wherever it is in the HTML. That's the difference from `span`: `span 2` starts where the item would come anyway, so it follows the HTML.

`1 / span 2` mixes the two: it starts at line 1 and takes two rows.

## Break it on purpose

Write `grid-row: 3 / 1`, the lines the wrong way round. The browser reads it as `1 / 3`, so nothing seems wrong. Now write `grid-row: 1 / 1`: the item starts and ends on the same line. That's no room at all, so the browser gives it just the one row after line 1, and Music is a small box again. Count the lines carefully: an item over two rows ends on the line **after** its second row.

---

## Mission: The crew on the left

The crew's card is the one the commander looks at first. It should take the whole left side of the first two rows.

**Example**:

```text
Crew on board    Oxygen         Water
6
                 Next launch (two columns)
Power            Days in orbit
```

- The Crew on board card gets the id `crew-count`.
- It takes the first column, from the top of the first row to the bottom of the second, on a computer and in a window 800 pixels wide. The Next launch card still takes two columns, beside it.
- It stays there even if it comes later in the HTML.

Psst, two rows end on row line 3 :)
