Your cards have frames. Three properties turn a frame into something that looks made with care: rounded corners, a border on one side only, and a shadow.

## Rounded corners

```css
.crate {
  border-radius: 8px;
}
```

`border-radius` rounds the corners, the bigger the rounder. It works with or without a border, on the background too, and on pictures. Like `padding`, it takes one value for all corners or four, starting top left and going round: `border-radius: 0 12px 12px 0` rounds only the right side. `50%` on a square makes a circle.

## One side

`border-top`, `border-right`, `border-bottom` and `border-left` set one side's border alone:

```css
.selected {
  border-left: 4px solid orange;
}
```

A line under a link, a bar down the side of a quote: one side is often all you need.

## Shadows

```css
.crate {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
```

`box-shadow` draws a shadow behind the box. Its values, in order:

1. how far right the shadow is moved (`0`);
2. how far down (`4px`, as if the light came from above);
3. how blurred its edge is (`12px`);
4. its color, almost always a see-through black.

A soft shadow lifts a card off the page. A hard, dark one looks old; keep them subtle.

---

## Mission: Polish

- Round every crew card's corners by `12px`, and give each the shadow `0 4px 12px rgba(0, 0, 0, 0.4)`.
- Round every picture's corners by `16px`.
- Give each link of the navigation a line along its bottom only, `2px solid #ffd166`.
