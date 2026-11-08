Your cards have frames. Three properties make a frame look like it was made with care: rounded corners, a border on one side only, and a shadow.

## Rounded corners

```css
.crate {
  border-radius: 8px;
}
```

`border-radius` rounds the corners: the bigger the number, the rounder they get. It works with or without a border, on the background too, and on pictures. Like `padding`, it takes one value for all corners, or four, starting at the top left and going round: `border-radius: 0 12px 12px 0` rounds only the right side. `50%` on a square makes a circle.

## One side

`border-top`, `border-right`, `border-bottom` and `border-left` set the border of one side only:

```css
.selected {
  border-left: 4px solid orange;
}
```

A line under a link, a bar down the side of a quote: often one side is all you need.

## Shadows

```css
.crate {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
```

`box-shadow` draws a shadow behind the box. Its values, in order:

1. how far to the right the shadow moves (`0`);
2. how far down it moves (`2px`, as if the light came from above);
3. how blurry its edge is (`6px`);
4. its color, almost always a see-through black.

A soft shadow makes a card look lifted off the page. A hard, dark one looks old-fashioned, so keep shadows gentle.

---

## Mission: Polish

Time to make the site look finished.

- Every crew card gets rounded corners and a soft shadow, so it looks lifted off the page.
- Every picture on the home page gets rounded corners too.
- The navigation's links get a line along their bottom only, in a color of your choice, like a tab you can click.
