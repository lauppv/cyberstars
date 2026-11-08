Sizes in CSS are a number and a **unit**: `16px`, `1.5rem`, `50%`. Which unit you pick decides how the size behaves when something around it changes.

## Absolute and relative

- **`px`**, pixels, is a fixed size. A border of `1px` is one thin line wherever it is.
- **`%`** is a share of the box around the element: `width: 50%` is half its parent's width.
- **`em`** is the element's font size: `2em` is twice as big as its own text. Used for `font-size`, it's the parent's font size, so sizes inside sizes multiply.
- **`rem`** is the font size of the page itself, the **root**: 16 pixels unless the visitor changed it. `2rem` is 32 pixels on most screens, and it doesn't multiply.
- **`vw`** and **`vh`** are one hundredth of the window's width and height.

## Why text sizes in rem

Many people raise their browser's font size so they can read comfortably. Sizes in `rem` grow with that setting; sizes in `px` ignore it, and those visitors are stuck with text too small for them. So:

- **`rem`** for font sizes;
- **`px`** for thin things that shouldn't grow, like borders;
- **`%`** when a box should follow the room it's in.

```css
h1 {
  font-size: 2rem; /* 32px, more if the visitor asks for more */
}
.note {
  font-size: 0.8em; /* a bit smaller than the text around it */
}
```

## Pictures that fit a phone

Your divider is 600 pixels wide. On a phone, the window is around 375 pixels wide, so the picture sticks out and the whole page scrolls sideways. A share of the room fixes it:

```css
img {
  max-width: 100%;
  height: auto;
}
```

`max-width: 100%`: never wider than the box it's in. `height: auto`: shrink the height with the width, so the picture keeps its shape. The `width` and `height` you wrote in the HTML still keep its room while it loads.

---

## Mission: Readable Sizes

- The page's text `1.125rem`.
- The biggest heading `2.5rem`, the section headings `1.5rem`.
- The address `0.9em`, a little smaller than the text around it.
- Pictures never wider than the room they're in, keeping their shape, so the page fits a phone without scrolling sideways.
