Children often inherit things from their parents: the colour of their eyes, their surname. Elements on a page inherit too. You've already used this without knowing it: when you gave the `body` a font and a text color, every element inside it took them.

## What's inherited

Some properties pass from an element to everything inside it, unless something inside has a rule of its own:

```css
.notice {
  color: gold;
  font-family: Georgia, serif;
}
```

```html
<div class="notice">
  <h3>Tonight</h3>
  <p>The club closes at <strong>18:00</strong>.</p>
</div>
```

The heading, the paragraph and the `<strong>` are all gold and in Georgia: they inherit from the `div` around them.

Text properties are inherited: `color`, `font-family`, `font-size`, `font-style`, `line-height`, `text-align`, `letter-spacing`...

## What isn't

Box properties are **not** inherited: `background-color`, `border`, `padding`, `margin`, `width`. If they were, a border on a `div` would draw a border around every paragraph inside it too.

A background seems to pass down, but it doesn't: the children are see-through by default, so the parent's background simply shows through them.

## Own rules win

Inheritance is the weakest rule of all. Any rule that picks the element itself, even just its tag, beats what it would inherit:

```css
.notice {
  color: gold;
}

p {
  color: white;
}
```

The paragraph in the notice is white: its own rule, `p`, beats the gold it would inherit.

## Break it on purpose

Put a border on the notice. Only the notice gets one, not its heading and paragraph. Borders don't pass down, and that's exactly what you want.

---

## Mission: The board's font

Departures boards at stations use a font where every letter has the same width, so the times line up.

**Example**: every cell of the flight table, headers included, shows in a monospace font, while the rest of the page keeps its font.

- The flight table is given a list of fonts that ends with `monospace`, once, on the table itself.
- Every cell of the table, headers and data, takes it from the table.

Psst, set it once on the table: the cells inherit it :)
