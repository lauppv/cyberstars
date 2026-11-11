A school timetable is a grid: days across the top, lessons down the side, and in each box one subject. You read it along a row, or down a column. Lists can't do that: some information only makes sense in rows and columns. That's a **table**.

## `<table>`, `<tr>`, `<td>`

A table is built row by row:

```html
<table>
  <tr>
    <td>Monday</td>
    <td>Maths</td>
    <td>Art</td>
  </tr>
  <tr>
    <td>Tuesday</td>
    <td>History</td>
    <td>Music</td>
  </tr>
</table>
```

```text
Monday    Maths     Art
Tuesday   History   Music
```

- `<table>` holds the whole table;
- `<tr>` is a **table row**;
- `<td>` is a **cell** in that row, short for "table data".

The browser lines the cells up into columns by itself: the first cell of every row goes in the first column, and so on. Each row should have the same number of cells.

## Break it on purpose

Leave out the `<tr>`s:

```html
<table>
  <td>Monday</td>
  <td>Maths</td>
  <td>Tuesday</td>
  <td>History</td>
</table>
```

All four cells end up in one long row: the browser only starts a new row where you start a new `<tr>`. And forget one cell in a row: that row is shorter, and its last column sits empty.

---

## Mission: The flight schedule

The station gets a third page: the flight schedule. Today's flights are:

```text
SL-101   Moon Base        08:30   Boarding
SL-102   Mars Relay       09:45   On time
SL-103   Europa Outpost   07:15   Delayed
SL-104   Lunar Gateway    11:00   Cancelled
SL-105   Orbital Yard     10:20   On time
```

**Example**: a new page, `schedule.html`, on the night blue of the site, shows a heading and the five flights in a grid, one flight per row.

- `schedule.html` is a whole page, in English, that can show any letter, with a name for its tab and a biggest heading, using the site's `style.css`.
- It has a table with the id `flights`, with one row per flight, in this order, and a cell for each of the four columns.
- Every page's menu has a third link, to `schedule.html`.

Psst, one `<tr>` per flight, one `<td>` per value :)
