A box's size is set with `width` and `height`. There's a catch in what they measure, and a one-line fix every modern site uses.

## What width measures

```css
.crate {
  width: 200px;
  padding: 20px;
  border: 5px solid orange;
}
```

How wide is that crate on screen? Not 200 pixels: 250. By default, `width` is the width of the **content** only, and the padding and border go around it: 200 + 20 + 20 + 5 + 5. Change the padding and the box grows. Ask for half the page, `width: 50%`, add padding, and two halves no longer fit side by side.

## border-box

```css
.crate {
  box-sizing: border-box;
}
```

With `box-sizing: border-box`, `width` is the whole box, border included: the crate is 200 pixels wide, and the padding takes its room from the inside. That's how most people think of a box, so most sites switch every element to it, at the top of their style sheet:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

`*` picks every element. `*::before` and `*::after` pick things CSS can add to an element, which you'll meet in part 3; for now, copy them along.

## Limits rather than sizes

A fixed `height` is rarely a good idea: text that doesn't fit spills out of its box, and a visitor with bigger text gets a page that breaks. Let the height follow the content, and set limits instead:

- `max-width`: never wider than this, narrower if the room is smaller. Great for long lines of text, which are hard to read past about 70 characters.
- `min-width`, `min-height`: never smaller than this, bigger if the content needs it.
- `max-height`: never taller.

---

## Mission: Measured Cards

- Switch every element of both pages to `border-box`, at the top of your style sheet.
- Make each card `260px` wide, border included, and at least `140px` tall.
- Keep the box of cards from growing past `900px`.
