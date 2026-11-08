Three pages, linked to each other, with headings, paragraphs, pictures, lists, cards and now tables. This recap adds a second table to the schedule, and gets the first ready for what's coming.

Worth keeping in mind:

- **`tr` for rows, `th` for headers, `td` for data**, and as many cells per row as there are columns, counting spans.
- **`caption`, `thead`, `tbody`, `tfoot`** say what the parts of a table are.
- **`scope`** ties a header to its column or row.
- **`colspan` and `rowspan`** stretch a cell; the row below a `rowspan` has one cell fewer.
- **Classes name what an element is**, so CSS and JavaScript can find it later.

---

## Mission: Docking Bays

- In the flights table, give every data cell of the body a class saying which column it's in: `code`, `destination`, `departs` and `status`. CSS and JavaScript will use them in the next lessons.
- Under the flights table, a section heading **Docking Bays** and a second table with the id `bays`, its caption **Docking bays**, a header row of **Bay**, **Time** and **Ship** in a `thead`, and in a `tbody` at least three rows. One bay serves two ships in a row: its cell covers the two rows.
