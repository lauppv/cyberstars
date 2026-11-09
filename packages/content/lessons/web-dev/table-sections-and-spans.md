A report has a title on top, a header, the body of the text, and a footer at the bottom of the page. Long tables are built the same way, in sections, so the browser and screen readers know which part is which.

## A title: `<caption>`

```html
<table>
  <caption>Club scores, March</caption>
  ...
</table>
```

`<caption>` is the table's title. It goes first, right after `<table>`, and the browser shows it centered above the table. A screen reader reads it first, so the listener knows what the table is about before the numbers start.

## Three sections

```html
<table>
  <caption>Club scores, March</caption>
  <thead>
    <tr><th scope="col">Name</th><th scope="col">Points</th></tr>
  </thead>
  <tbody>
    <tr><td>Sam</td><td>12</td></tr>
    <tr><td>Lea</td><td>9</td></tr>
  </tbody>
  <tfoot>
    <tr><td>Total</td><td>21</td></tr>
  </tfoot>
</table>
```

- `<thead>`: the header rows, with the labels;
- `<tbody>`: the body, the rows of data;
- `<tfoot>`: the footer, for totals or a note.

On the screen they look like plain rows. But the sections let CSS style each part, and JavaScript find the data rows alone: "every row of the `tbody`". When a long table is printed, the browser can repeat the `thead` on every page.

## Break it on purpose

Put the caption at the end of the table, after `</tbody>`. It may still show on top in some browsers, but the HTML is wrong, and a screen reader may read it last, after all the numbers. The caption always comes first.

---

## Mission: Sections

The flight table needs a title and its sections.

**Example**: the table now shows a title above it, like `Departures today`, then the labels, the five flights, and a last row with a note like `All times in station time`.

- `#flights` has a caption, as its title.
- Its header row is in a `<thead>`, the five flights in a `<tbody>`, and a last row with a note of your own in a `<tfoot>`.

Psst, the caption goes right after `<table>` :)
