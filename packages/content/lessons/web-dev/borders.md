Back to the framed photo: around the white strip of card comes the frame itself. Some frames are thin and black, some thick and golden, some made of little dots. On a web page, that frame is the box's **border**.

## `border`

A border has three parts: how **thick** it is, its **style**, and its **color**:

```css
.member {
  border: 2px solid gold;
}
```

A 2-pixel, solid, gold line all around the box. It sits right outside the padding.

The three parts can come in any order, with a space between them. The styles you'll use most:

- `solid`: one plain line;
- `dashed`: short dashes, like a coupon you cut out;
- `dotted`: a row of dots;
- `double`: two thin lines (it needs at least 3 pixels to show).

```css
.coupon {
  border: 3px dashed tomato;
}
```

## The box grows

A border adds to the box's size: a card with a 2-pixel border is 4 pixels wider than before, 2 on each side. You'll see how to control that in a later lesson.

## Break it on purpose

Leave out the style:

```css
.member {
  border: 2px gold;
}
```

No border at all! Without a style, a border's style is `none`, and a border of style `none` doesn't show, whatever its thickness and color. Of the three parts, the style is the one you can't skip.

---

## Mission: Framed cards

Your crew cards have a background and room inside. Give them a frame.

**Example**: every card has a thin line all around it, in a color that goes with its background.

- Every card has a border all around it, of any style but `none`.
- The border is at least 1 pixel thick.

Psst, a border needs its style, or it doesn't show :)
