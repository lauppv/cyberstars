Your table works. A few more elements make it clearer, to the visitor and to a screen reader, and let one cell cover several.

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

- `caption` is the table's title, right after `<table>`. A screen reader announces it first, so the visitor knows what the table is before the cells start.
- `thead` holds the header rows, `tbody` the data, `tfoot` the summary or notes at the end. They group rows; CSS and JavaScript can pick each group.
- `scope="col"` on a header says it names its **column**; `scope="row"` names a row. It tells a screen reader which cells a header belongs to.

## Spanning cells

A cell can stretch over several:

- `colspan="2"`: as wide as two columns;
- `rowspan="2"`: as tall as two rows. The row below then has one cell fewer, since that place is taken.

Count carefully: in every row, each cell counts as many columns as its `colspan`, and the totals must match.

---

## Mission: A Proper Board

Rework your flights table:

- a caption: **Departures today**;
- the header row in a `thead`, each of its headers naming its column with `scope`;
- the flights in a `tbody`;
- a `tfoot` with one row of a single cell, as wide as all four columns, that says **All times in station time**.
