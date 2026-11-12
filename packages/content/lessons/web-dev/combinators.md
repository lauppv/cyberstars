"Everyone in Class 7B, stand up." Not everyone in the school, only the pupils inside one class. CSS can say that too: style an element only when it's **inside** another one.

## The descendant selector: a space

Two selectors with a space between them pick elements that sit **inside** the first:

```css preview
<style>
  td {
    background-color: lightyellow;
  }

  /* show */
  #scores td {
    padding: 8px;
  }
  /* /show */
</style>
<table id="scores">
  <tr><td>Sam</td><td>12</td></tr>
  <tr><td>Lea</td><td>9</td></tr>
</table>
<p>Last month:</p>
<table>
  <tr><td>Sam</td><td>8</td></tr>
  <tr><td>Lea</td><td>11</td></tr>
</table>
```

This means "every `td` inside the element with the id `scores`". The cells of the `#scores` table get room inside them. Cells of any other table on the page stay as they were.

"Inside" means anywhere inside: a child, a grandchild, deeper still. The `td` is in a `tr`, in a `tbody`, in the table, and the space still finds it.

## Reading it right to left

The browser reads a selector from the end: "a `td`... that sits inside `#scores`". So the **last** part is what gets styled. `#scores td` styles cells, `td #scores` would style something called `#scores` inside a cell.

A few more:

- `nav a`: links inside a menu, not the other links of the page;
- `.card h3`: headings inside cards;
- `footer p`: paragraphs in a footer.

## Break it on purpose

Forget the space:

```css preview
<style>
  td {
    background-color: lightyellow;
  }

  /* show */
  #scores.td {
    padding: 8px;
  }
  /* /show */
</style>
<table id="scores">
  <tr><td>Sam</td><td>12</td></tr>
  <tr><td>Lea</td><td>9</td></tr>
</table>
<p>Last month:</p>
<table>
  <tr><td>Sam</td><td>8</td></tr>
  <tr><td>Lea</td><td>11</td></tr>
</table>
```

Now it means "the element with the id `scores` **and** the class `td`", one element with both. Nothing has that, so nothing changes. A space means "inside", no space means "the same element".

---

## Mission: Room in the flights

The flight table's cells are squashed together. The docking bays table is fine as it is.

**Example**: the flight table's cells have room inside them, and the docking bays table looks exactly as before.

- Every cell of the flight table (`#flights`), headers and data, has at least 8 pixels of room inside on its left and right.
- The docking bays table's cells don't change.

Psst, a space between two selectors means "inside" :)
