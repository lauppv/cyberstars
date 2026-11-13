A recipe never says "stir, stir, stir, stir, stir, stir, stir, stir, stir, stir". It says "stir 10 times". Saying how many times is shorter, and you can't lose count. CSS can count for you too.

## The long way

A grid with five equal columns, written out:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .seat {
    background-color: #1e3a5f;
    padding: 8px 0;
    margin: 0;
    text-align: center;
  }

  /* show */
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    gap: 8px;
  }
  /* /show */
</style>
<div class="row">
  <p class="seat">A1</p>
  <p class="seat">A2</p>
  <p class="seat">A3</p>
  <p class="seat">A4</p>
  <p class="seat">A5</p>
</div>
```

Five seats of a cinema row, each one fifth of the width. It works, but count the `1fr`s: are there five? With twelve columns, you would have to count twelve.

## `repeat()`

`repeat()` takes a number and what to repeat:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .seat {
    background-color: #1e3a5f;
    padding: 8px 0;
    margin: 0;
    text-align: center;
  }

  /* show */
  .row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
  }
  /* /show */
</style>
<div class="row">
  <p class="seat">A1</p>
  <p class="seat">A2</p>
  <p class="seat">A3</p>
  <p class="seat">A4</p>
  <p class="seat">A5</p>
</div>
```

`repeat(5, 1fr)` means `1fr` five times. The page looks exactly the same: it's only a shorter way to write it. Change the 5 to a 3: three seats a row now, and the other two go to a new row.

## Repeating more than one size

The second part can hold several sizes. They are repeated together, in their order:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .seat {
    background-color: #1e3a5f;
    padding: 8px 0;
    margin: 0;
    text-align: center;
  }

  /* show */
  .row {
    display: grid;
    grid-template-columns: repeat(2, 2fr 1fr);
    gap: 8px;
  }
  /* /show */
</style>
<div class="row">
  <p class="seat">A1</p>
  <p class="seat">A2</p>
  <p class="seat">A3</p>
  <p class="seat">A4</p>
</div>
```

That's `2fr 1fr 2fr 1fr`: a wide seat, a narrow one, a wide one, a narrow one.

## Break it on purpose

Forget the comma: `repeat(5 1fr)`. The browser doesn't understand it, so it throws away the whole line, and the grid has no columns: every seat takes a row of its own. The same happens with a space between `repeat` and its `(`. When a grid falls back to one column, check your `repeat()`.

---

## Mission: This week

The crew plans the week on the dashboard. They want the days of the week in one strip under the cards.

**Example**: under the cards, a heading such as "This week", then seven boxes in one row across the whole width:

```text
Mon   Tue   Wed   Thu   Fri   Sat   Sun
```

- Under the cards and before the panels, a heading and an ordered list with the class `week`, with the seven days of the week, Monday first. Each day has a background of its own.
- On a computer and in a window 800 pixels wide, the seven days stand in one row, all the same width, across the whole width of the list, with room between them.
- More days make more rows of seven.

Psst, a list has room on its left for its numbers: `padding: 0` takes it away :)
