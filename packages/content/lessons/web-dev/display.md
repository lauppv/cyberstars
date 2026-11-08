You've met two kinds of box. **Block** boxes, like paragraphs and divs, start on a new line and take the whole width. **Inline** boxes, like links and spans, sit inside a line of text. The `display` property decides which kind an element is, and you can change it.

## The main values

- `display: block`: a new line, the whole width, and `width`, `height`, `margin` and `padding` all work.
- `display: inline`: sits in the line. `width` and `height` are ignored, and padding on the top and bottom doesn't push the lines apart.
- `display: inline-block`: sits in the line like a word, **and** takes a width, a height and padding like a block. The boxes stand side by side, and go on to the next line when the row is full.
- `display: none`: the element is gone, as if it weren't in the HTML. It takes no space, and a screen reader doesn't read it either.

```css
.tag {
  display: inline-block;
  padding: 4px 10px;
  margin-right: 8px;
}
```

Inline-block boxes line up like words, so they keep the space a word would have between them: the spaces and new lines between their tags in the HTML. And like words, they line up at the bottom of their line, unless you say otherwise: `vertical-align: top` lines them up at their tops.

CSS has stronger tools for putting boxes in rows and grids, `flex` and `grid`, which come in a later part. `inline-block` is the simple one, and it's enough for a row of cards that wraps.

## Bigger targets

A link is inline, so padding doesn't make it any taller to tap. As an `inline-block` with padding, the whole padded box becomes the link, and it's easier to hit with a finger.

To pick only the navigation's links, and not every link of the page, write two names with a space between them: `nav a` means every `a` inside a `nav`. Part 3 tells you more about selectors like this one.

---

## Mission: Side by Side

The crew directory has a long column of cards. On a wide screen, there's room for several in a row.

- On a wide screen, the cards stand side by side, at least `12px` apart, lined up at their tops even when one card holds more text than the others. On a phone, they stand one under the other, and nothing sticks out.
- The navigation's links are small and hard to tap on a phone. Make each one a target at least `40px` tall, still side by side.
