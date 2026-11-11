On a timetable, a double lesson takes two boxes in a row, merged into one. And a note at the bottom, like "school closes at 15:00 on Friday", runs across all the columns. Table cells can stretch like that.

## `colspan`: across columns

```html
<tfoot>
  <tr>
    <td colspan="3">School closes at 15:00 on Friday</td>
  </tr>
</tfoot>
```

`colspan="3"` makes the cell three columns wide. A row in a 3-column table now needs only this one cell.

## `rowspan`: down rows

```html
<tr>
  <td rowspan="2">Monday</td>
  <td>Maths</td>
</tr>
<tr>
  <td>Art</td>
</tr>
```

```text
Monday   Maths
         Art
```

`rowspan="2"` makes "Monday" two rows tall. The second row has one cell fewer: the place on its left is already taken by Monday.

## Count the cells

The trick with spans is counting: every row must still add up to the same number of columns. A cell with `colspan="3"` counts as three. A cell with `rowspan="2"` also takes a place in the row under it, so that row has one `td` less.

## Break it on purpose

Keep the extra cell in the second row:

```html
<tr>
  <td rowspan="2">Monday</td>
  <td>Maths</td>
</tr>
<tr>
  <td>Art</td>
  <td>Music</td>
</tr>
```

"Music" sticks out into a new column on the right, past the edge of the table. The second row has one cell too many: Monday was already in its first place.

---

## Mission: The footer and the bays

The flight table's note should run across the whole table. And the schedule page gets a second table, for the docking bays, where one bay has two ships today.

**Example**: the note in the table's footer spans all four columns. Under the flights, a part called Docking Bays shows:

```text
Bay     Time    Ship
Bay 1   08:00   Kestrel
        13:00   Heron
Bay 2   10:30   Albatross
```

- The footer's note is one cell, as wide as the four columns.
- A part with a heading one level under the page's heading, Docking Bays, and a table with the id `bays`: a header row with Bay, Time and Ship, then a row per ship.
- Bay 1's cell spans its two ships' rows.

Psst, a cell spanning two rows takes a place in the row under it :)
