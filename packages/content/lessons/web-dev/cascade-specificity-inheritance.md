You've seen rules compete: an id beating a type, a later rule beating an earlier one. Here is the whole story, the **cascade**: how the browser decides which value an element gets when several rules want to set it.

## 1. Specificity

The more precisely a selector names an element, the stronger it is. Count three things in it:

- **ids**: `#flights`;
- **classes, attributes and pseudo-classes**: `.warning`, `[scope="col"]`, `:hover`;
- **types and pseudo-elements**: `td`, `::after`.

Compare the counts from left to right: one id beats any number of classes, one class beats any number of types.

| Selector                   | ids | classes | types |
| -------------------------- | --- | ------- | ----- |
| `td`                       | 0   | 0       | 1     |
| `.cancelled td`            | 0   | 1       | 1     |
| `#flights td`              | 1   | 0       | 1     |
| `#flights tr.cancelled td` | 1   | 1       | 2     |

So `.cancelled td` loses to `#flights td`, however late it comes. A `style` attribute beats them all.

## 2. Order

Between two selectors of the same strength, the one that comes **later** wins: later in the file, or in a later style sheet.

## 3. Inheritance

Some properties, mostly about text, pass from an element to everything inside it: `color`, `font-family`, `font-size`, `line-height`, `text-align`. That's why setting a font on `body` sets it everywhere. Others, about the box, don't: `border`, `padding`, `margin`, `background`. A border on a table doesn't give every cell a border.

An inherited value is the weakest of all: any rule that picks the element itself, even a plain `td`, beats what its parent passes down.

## !important

`color: red !important;` jumps over all of this. It's a way out that makes the next fix harder, since only another `!important` beats it. When a rule doesn't apply, make its selector a little more specific instead.

---

## Mission: Grounded

- Every data cell of the flights table: text in `#dbe4ff`.
- The cancelled flight's row gets the class `cancelled`. Its cells: text in `#8a94a8`, struck through. Your selector has to beat the one above.
- The flights table is set in `"Courier New", monospace`, set once on the table, so every cell and the caption inherit it.
