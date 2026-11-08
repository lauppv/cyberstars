Your table works. A few more elements make it clearer, for the visitor and for a screen reader, and let one cell stretch over several.

## Head, body and foot

```html
<table>
  <caption>Cargo, Bay 2</caption>
  <thead>
    <tr>
      <th scope="col">Crate</th>
      <th scope="col">Weight</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Water</td>
      <td>120 kg</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2">Weighed this morning</td>
    </tr>
  </tfoot>
</table>
```

- `caption` is the table's title, right after `<table>`. A screen reader reads it first, so the visitor knows what the table is about before the cells start.
- `thead` holds the header rows, `tbody` the data, and `tfoot` the summary or notes at the end. They group rows, and CSS and JavaScript can pick each group.
- `scope="col"` on a header says it names its **column**, and `scope="row"` says it names a row. It tells a screen reader which cells belong to a header.

## Spanning cells

A cell can stretch over several:

- `colspan="2"`: as wide as two columns;
- `rowspan="2"`: as tall as two rows. The row below then has one cell fewer, because that place is already taken.

Count carefully: in every row, each cell counts for as many columns as its `colspan`, and every row must add up to the same total.

---

## Mission: A Proper Board

A visitor who can't see the screen will hear your departures table read out loud. Make it easy to follow:

- Before any cell, they should hear what the table is: **Departures today**.
- The row that names the columns is set apart from the flights, and each of its cells says that it names its column.
- The flights are grouped together as the table's data.
- At the very bottom, a note that stretches across the whole width of the table, in one cell: **All times in station time**.
