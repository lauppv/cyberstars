To the browser, every element is a **box**, a rectangle, even a single word in a `<span>`. Laying out a page is deciding how big those boxes are and how far apart. It starts with what a box is made of.

## Four layers

From the inside out:

1. **Content**: the text or picture itself.
2. **Padding**: room between the content and the border, inside the box. It takes the box's background.
3. **Border**: a line around the padding.
4. **Margin**: room outside the border, between this box and its neighbors. It's always see-through.

A sign on a hatch shows the first three. Its words get room inside the sign, and a line goes round it:

```css
.hatch-sign {
  background-color: #5a1010;
  padding: 6px;
  border: 4px double gold;
}
```

The fourth, margin, is the room a box keeps from the boxes around it. Pictures in a gallery keep their distance like this:

```css
.photo {
  margin-right: 30px;
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

On the crew page, the cards run into one another: you can't tell where one crew member ends and the next begins, and the words sit right on the edges. Make every card a panel of its own:

- a background of its own, so the card shows against the page, with its text still readable on it;
- room inside, at least `8px` on every side, so no word touches the card's edge;
- a frame you can see all the way round;
- room between one card and the next, at least `12px`, so no two cards touch.

How much room, and which colors, is up to you. Open **Inspect** on a card to see its layers while you work.
