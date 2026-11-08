Part 3 adds the station's third page, the **Flight Schedule**: every departure of the day, with where it goes, when, and how it's doing. Data in rows and columns is a **table**.

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
- `tr`, a **table row**, holds one row's cells, left to right.
- `td`, **table data**, is an ordinary cell.
- `th`, a **table header**, is a cell that names a column (or a row). The browser draws it bold and centered.

Every row should have as many cells as the others, or the columns slip.

## Tables are for data

A screen reader reads a table cell by cell and can tell the visitor which column header each cell sits under: "Weight, 45 kg". That only works for real tables, with real headers. Long ago, people built whole page layouts out of tables; don't. A table is for data that has rows and columns, like a schedule, a price list, a score board.

This lesson brought an empty `schedule.html`.

---

## Mission: Departures

- Write `schedule.html` as a complete page like the other two: in English, able to show any letter, **Flight Schedule** on its tab and as its biggest heading, linked to `style.css`, with the same navigation.
- Add a fourth link to the navigation of **all three** pages: **Schedule**, to `schedule.html`.
- Under the heading, a table with the id `flights`. Its first row holds four header cells: **Flight**, **Destination**, **Departs** and **Status**. Under it, at least four flights, one row each, four cells each: a flight code like `SL-101`, a destination, a time like `08:30`, and a status: `On time`, `Boarding`, `Delayed` or `Cancelled`.
