A **pseudo-element** is a piece of an element that CSS can style as if it were an element of its own, even though it isn't in the HTML. Pseudo-elements start with two colons.

## ::before and ::after

```css
.fragile::before {
  content: "⚠ ";
}
```

`::before` adds a box at the very start of the element's content, and `::after` at the very end. The `content` property says what's in it: text in quotes, or `""`, an empty string, for a box that's only there to be styled. Without `content`, nothing shows up at all.

```css
h3::after {
  content: "";
  display: block;
  width: 40px;
  height: 3px;
  background-color: orange;
}
```

That draws a short bar under every `h3`, without any element in the HTML for it.

Use them for **decoration**: icons, marks, lines. Some screen readers read `content` text and some don't, and it can't be selected or copied. So anything that carries meaning belongs in the HTML.

## A few others

- `::first-letter` and `::first-line`: the first letter or the first line of a block.
- `::marker`: a list item's bullet or number.
- `::placeholder`: the grey hint text in an empty box you type in.

You met `*::before, *::after` in your `box-sizing` rule. Now you know what they pick.

---

## Mission: Marks

Small marks help visitors without changing the HTML. Add them with CSS only:

- Every link to another site ends with ` ↗` (a space, then the arrow), so visitors know it leaves the station's site. The other links get no arrow.
- Every warning starts with `⚠ ` (the sign, then a space).
- Under every section heading, a short bar in a color of your choice, between `20px` and `120px` wide and between `2px` and `8px` tall, standing on its own line under the heading's text.
