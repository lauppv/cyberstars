You set a box's size with `width` and `height`. But there's a catch in what they measure, and almost every modern site fixes it with one rule.

## What width measures

```css
.crate {
  width: 200px;
  padding: 20px;
  border: 5px solid orange;
}
```

How wide is that crate on the screen? Not 200 pixels, but 250. Normally `width` is only the width of the **content**, and the padding and border go around it: 200 + 20 + 20 + 5 + 5. Change the padding, and the box grows. Ask for half the page, `width: 50%`, add some padding, and two halves don't fit side by side any more.

## border-box

```css
.crate {
  box-sizing: border-box;
}
```

With `box-sizing: border-box`, `width` is the whole box, border included. The crate is 200 pixels wide, and the padding takes its space from the inside. That's how most people think about a box, so most sites switch every element to it, at the top of their style sheet:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

`*` picks every element. `*::before` and `*::after` pick things CSS can add to an element. You'll meet them in part 3. For now, just copy them along.

## Limits rather than sizes

A fixed `height` is almost never a good idea. Text that doesn't fit spills out of its box, and a visitor with bigger text gets a broken page. Let the height follow the content, and set limits instead:

- `max-width`: never wider than this, but narrower if there's less space. Great for text: lines longer than about 70 letters are hard to read.
- `min-width`, `min-height`: never smaller than this, but bigger if the content needs it.
- `max-height`: never taller than this.

---

## Mission: Measured Cards

The crew cards should all have the same size, whatever they hold.

- Make every element of both pages count its padding and border inside its width.
- Every card is the same width, between `200px` and `320px`, border included. Changing a card's padding must not change its width.
- A card is at least `120px` tall, so even a short one looks like a card. A card with more to say grows taller.
- On a very wide screen, the box of cards stops growing at `900px`. On a phone, it still fits the screen.
