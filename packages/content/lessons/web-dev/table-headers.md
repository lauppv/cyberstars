Look at your timetable again: across the top, Monday, Tuesday, Wednesday. Those aren't lessons: they're labels that say what each column is. Without them, you'd have to guess which column is which day.

## `<th>`: a header cell

A cell that **labels** a column is a `<th>`, a table header, instead of a `<td>`:

```html preview
<table>
  <tr>
    <th scope="col">Day</th>
    <th scope="col">First lesson</th>
  </tr>
  <tr>
    <td>Monday</td>
    <td>Maths</td>
  </tr>
</table>
```

The browser shows header cells in bold and centered. More importantly, a screen reader now knows that "Maths" is the "First lesson": it can read the header out with each cell.

`scope="col"` says the header labels a **column**. A header at the start of a row, labelling the whole row, would be `scope="row"`.

## Tables are for data

A table is for information that really has rows and columns: a timetable, scores, prices. Long ago, people used tables to lay out whole pages, putting a menu in one cell and the text in another. Don't: screen readers read it as a grid of data, and it's a nightmare on a phone. Layout is a job for CSS.

## Break it on purpose

Make the header row with `<td>` and `<strong>`:

```html preview
<table>
<!-- show -->
<tr>
  <td><strong>Day</strong></td>
  <td><strong>First lesson</strong></td>
</tr>
<!-- /show -->
<tr>
  <td>Monday</td>
  <td>Maths</td>
</tr>
</table>
```

It looks almost the same. But to a screen reader, it's just another row of data, and no cell below it has a label. Looks aren't meaning: a label is a `<th>`.

---

## Mission: Labelled columns

The flight table has four columns, but nothing says what they are.

**Example**: the table starts with a row of four bold labels:

```text
Flight   Destination   Departs   Status
```

- The first row of `#flights` holds four header cells, `<th>`, one for each column: Flight, Destination, Departs and Status.
- Each says it labels a column.

Psst, `scope="col"` :)
