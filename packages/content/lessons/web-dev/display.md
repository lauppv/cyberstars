You've met two kinds of box: **block** boxes, like paragraphs and divs, which start on a new line and take the whole width, and **inline** boxes, like links and spans, which flow inside a line of text. The `display` property decides which kind an element is, and you can change it.

## The main values

- `display: block`: a new line, the whole width, and `width`, `height`, `margin` and `padding` all work.
- `display: inline`: flows in the line. `width` and `height` are ignored, and padding on top and bottom doesn't push the lines apart.
- `display: inline-block`: flows in the line like a word, **and** takes a width, a height and padding like a block. Boxes side by side, wrapping to the next line when the row is full.
- `display: none`: the element is gone, as if it weren't in the HTML. It takes no room, and a screen reader doesn't read it either.

```css
.tag {
  display: inline-block;
  padding: 4px 10px;
  margin-right: 8px;
}
```

Inline-block boxes line up like words, so they keep the space a word would have between them: the spaces and new lines between their tags in the HTML. And like words, they line up at the bottom of the text unless you say otherwise: `vertical-align: top` lines them up at their tops.

CSS has stronger tools for laying out boxes in rows and grids, `flex` and `grid`, that a later part brings. `inline-block` is the simple one, and it's enough for a row of cards that wraps.

## Bigger targets

A link is inline, so its padding doesn't make it any taller to tap. As an `inline-block` with padding, the whole padded box becomes the link: easier to hit with a finger.

To pick only the navigation's links, and not every link of the page, write two names with a space between them: `nav a` means every `a` inside a `nav`. Part 3 comes back to selectors like this one.

---

## Mission: Side by Side

- Put the crew cards side by side: inline boxes that take their width, lined up at their tops, with `16px` of room to the right of each. On a wide screen they stand in a row; on a phone, one under the other.
- Make the navigation's links inline boxes too, with `8px` of padding above and below and `12px` on the sides.
