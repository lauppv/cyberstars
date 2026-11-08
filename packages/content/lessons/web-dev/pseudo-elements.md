A **pseudo-element** is a piece of an element CSS can style as if it were an element of its own, though it isn't in the HTML. They start with two colons.

## ::before and ::after

```css
.fragile::before {
  content: "⚠ ";
}
```

`::before` adds a box at the very start of the element's content, `::after` at the very end. The `content` property says what's in it: text in quotes, or `""`, an empty string, for a box that's only there to be styled. Without `content`, nothing appears at all.

```css
h3::after {
  content: "";
  display: block;
  width: 40px;
  height: 3px;
  background-color: orange;
}
```

That draws a short bar under every `h3`, with no element in the HTML for it.

Use them for **decoration**: icons, marks, lines. Some screen readers read `content` text and some don't, and it can't be selected or copied, so anything that carries meaning belongs in the HTML.

## A few others

- `::first-letter` and `::first-line`: the first letter, the first line of a block.
- `::marker`: a list item's bullet or number.
- `::placeholder`: the grey hint text in an empty input.

You met `*::before, *::after` in your `box-sizing` rule: now you know what they pick.

---

## Mission: Marks

- Every link to another site, starting with `https://`, ends with ` ↗` (a space, then the arrow), added by CSS.
- Every warning starts with `⚠ ` (the sign, then a space), added by CSS.
- Under every section heading, a bar `48px` wide and `3px` tall, in `#ffd166`, with `6px` of room above it, made with `::after`.
