You've seen rules compete: an id beating a type, a later rule beating an earlier one. Here's the whole story, called the **cascade**: how the browser decides which value an element gets when several rules want to set it.

## 1. Specificity

The more exactly a selector names an element, the stronger it is. Count three things in it:

- **ids**: `#flights`;
- **classes, attributes and pseudo-classes**: `.warning`, `[scope="col"]`, `:hover`;
- **types and pseudo-elements**: `td`, `::after`.

Compare the counts from left to right: one id beats any number of classes, and one class beats any number of types.

| Selector                   | ids | classes | types |
| -------------------------- | --- | ------- | ----- |
| `td`                       | 0   | 0       | 1     |
| `.cancelled td`            | 0   | 1       | 1     |
| `#flights td`              | 1   | 0       | 1     |
| `#flights tr.cancelled td` | 1   | 1       | 2     |

So `.cancelled td` loses to `#flights td`, even if it comes later. A `style` attribute beats them all.

## 2. Order

When two selectors are equally strong, the one that comes **later** wins: later in the file, or in a later style sheet.

## 3. Inheritance

Some properties, mostly about text, pass from an element to everything inside it: `color`, `font-family`, `font-size`, `line-height`, `text-align`. That's why a font set on `body` shows up everywhere. Others, about the box, don't pass down: `border`, `padding`, `margin`, `background`. A border on a table doesn't give every cell a border.

A value passed down from a parent is the weakest of all. Any rule that picks the element itself, even a plain `td`, beats it.

## !important

`color: red !important;` jumps over all of this. It looks like an easy way out, but it makes the next fix harder, because only another `!important` can beat it. When a rule doesn't work, make its selector a little more exact instead.

---

## Mission: Grounded

The schedule needs to show at a glance which flight won't leave.

- Every data cell of the flights table gets a text color of its own, different from the paragraphs' and easy to read.
- Put the cancelled flight's row in the class `cancelled`: later lessons use it. Its cells look faded next to the other flights, but stay readable, and their text is struck through. Your rule has to win against the rule above.
- The whole flights table, its cells and its title too, is set in a font where every letter is equally wide. Set it once, on the table, and let everything inside get it from there.
