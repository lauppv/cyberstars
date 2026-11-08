To the browser, every element is a **box**, a rectangle, even a single word in a `<span>`. Laying out a page is deciding how big those boxes are and how far apart. It starts with what a box is made of.

## Four layers

From the inside out:

1. **Content**: the text or picture itself.
2. **Padding**: room between the content and the border, inside the box. It takes the box's background.
3. **Border**: a line around the padding.
4. **Margin**: room outside the border, between this box and its neighbors. It's always see-through.

```css
.crate {
  background-color: #2b2b2b;
  padding: 12px;
  border: 3px solid orange;
  margin-bottom: 20px;
}
```

`border` takes three values at once: its width, its style (`solid`, `dashed`, `dotted`...) and its color. Without a style, there is no border at all.

## One side or all four

`padding` and `margin` can be set for one side, `padding-top`, `margin-left`, or for all at once:

```css
padding: 12px; /* all four sides */
padding: 12px 24px; /* top and bottom, then left and right */
padding: 4px 8px 12px 16px; /* top, right, bottom, left */
```

Four values go round like a clock's hand, from the top.

## Seeing the boxes

In any browser, right-click an element and pick **Inspect**: the developer tools draw its box, padding in one color, margin in another, with every size written next to it. When a page's spacing puzzles you, that's the first place to look.

One surprise you'll meet there: when two boxes stand one above the other, their vertical margins don't add up; the bigger one wins. A heading with a margin of 20px under a paragraph with 16px are 20px apart, not 36px.

---

## Mission: Card Frames

On the crew page, every card becomes a framed panel:

- a background of `#13294f`;
- `16px` of padding on every side;
- a border `2px solid #2c4a7a`;
- `24px` of room under each card, before the next one.
