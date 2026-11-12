Draw a grid on paper, then draw a separate little box around every square. Where two squares meet, you get two lines side by side, with a gap between them. Messy. A grid looks right when neighbouring squares **share** one line. Tables have the same problem.

## The double lines

Give every cell a border:

```css preview
<style>
  /* show */
  #scores td,
  #scores th {
    border: 1px solid gray;
  }
  /* /show */
</style>
<table id="scores">
  <tr><th scope="col">Name</th><th scope="col">Points</th></tr>
  <tr><td>Sam</td><td>12</td></tr>
  <tr><td>Lea</td><td>9</td></tr>
</table>
```

The comma between the two selectors means "this rule is for both". Each cell now has its own box, and where two cells meet, you see two thin lines with a small gap between them.

## `border-collapse: collapse`

On the table itself:

```css preview
<style>
  #scores td,
  #scores th {
    border: 1px solid gray;
  }

  /* show */
  #scores {
    border-collapse: collapse;
  }
  /* /show */
</style>
<table id="scores">
  <tr><th scope="col">Name</th><th scope="col">Points</th></tr>
  <tr><td>Sam</td><td>12</td></tr>
  <tr><td>Lea</td><td>9</td></tr>
</table>
```

Neighbouring cells now share their borders: one line between two cells, no gap. The table looks like a clean grid.

The opposite value, `separate`, is what tables do by default: every cell keeps its own border.

## Just lines between rows

Often a table looks calmer with only a line under each row:

```css preview
<style>
  #scores {
    border-collapse: collapse;
  }

  /* show */
  #scores td,
  #scores th {
    border-bottom: 1px solid #2c4a7a;
  }
  /* /show */
</style>
<table id="scores">
  <tr><th scope="col">Name</th><th scope="col">Points</th></tr>
  <tr><td>Sam</td><td>12</td></tr>
  <tr><td>Lea</td><td>9</td></tr>
</table>
```

With `collapse`, the lines run straight across the whole row, with no gaps at the columns.

## Break it on purpose

Put `border-collapse` on the cells instead of the table:

```css preview
<style>
  #scores td,
  #scores th {
    border: 1px solid gray;
  }

  /* show */
  #scores td {
    border-collapse: collapse;
  }
  /* /show */
</style>
<table id="scores">
  <tr><th scope="col">Name</th><th scope="col">Points</th></tr>
  <tr><td>Sam</td><td>12</td></tr>
  <tr><td>Lea</td><td>9</td></tr>
</table>
```

Nothing changes. `border-collapse` is a property of the **table**: it decides how its cells meet. On a cell, it means nothing.

---

## Mission: A clean grid

The flight table needs lines to guide the eye along each row.

**Example**: a thin line runs under every row of the flight table, straight across, without gaps between the cells.

- The flight table's cells share their borders.
- Every cell of the flight table, headers and data, has a line along its bottom.

Psst, `border-collapse` goes on the table itself :)
