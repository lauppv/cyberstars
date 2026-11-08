Part 3 adds the station's third page, the **Flight Schedule**: every departure of the day, with where it goes, when it leaves, and how it's doing. Data in rows and columns is a **table**.

## Rows and cells

```html
<table>
  <tr>
    <th>Crate</th>
    <th>Weight</th>
  </tr>
  <tr>
    <td>Water</td>
    <td>120 kg</td>
  </tr>
  <tr>
    <td>Seeds</td>
    <td>45 kg</td>
  </tr>
</table>
```

- `table` holds the whole table.
- `tr`, a **table row**, holds one row's cells, from left to right.
- `td`, **table data**, is a normal cell.
- `th`, a **table header**, is a cell that names a column (or a row). The browser shows it bold and centered.

Every row should have as many cells as the others, or the columns get out of line.

## Tables are for data

A screen reader reads a table cell by cell, and it can tell the visitor which column each cell belongs to: "Weight, 45 kg". That only works for real tables, with real headers. Long ago, people built whole page layouts out of tables. Don't. A table is for data that has rows and columns, like a schedule, a price list or a score board.

This lesson added an empty `schedule.html`.

---

## Mission: Departures

The station gets its third page: the board of the day's departures.

- Write `schedule.html` as a complete page like the other two: English, able to show any letter, **Flight Schedule** on its tab and as its title, with the same look and the same navigation.
- Every page should lead to the new one: add a fourth link, **Schedule**, to the navigation of **all three** pages.
- Under the title, the departures as a table with the id `flights`. Its first row names the four columns: **Flight**, **Destination**, **Departs** and **Status**. Under it, at least four flights, one per row: a flight code like `SL-101`, where it goes, a time like `08:30`, and how it's doing: `On time`, `Boarding`, `Delayed` or `Cancelled`. Later lessons read these four statuses, so use them exactly.
