A size in CSS is a number and a **unit**: `16px`, `1.5rem`, `50%`. The unit you pick decides what happens to the size when something around it changes.

## Absolute and relative

- **`px`**, pixels, is a fixed size. A `1px` border is one thin line, wherever it is.
- **`%`** is a part of the box around the element: `width: 50%` is half the width of its parent.
- **`em`** is the size of the element's text: `2em` is twice as big. When you use it for `font-size`, it means the parent's text size, so sizes inside sizes multiply.
- **`rem`** is the text size of the whole page, the **root**: 16 pixels, unless the visitor changed it. `2rem` is 32 pixels on most screens, and it never multiplies.
- **`vw`** and **`vh`** are one hundredth of the window's width and height.

## Why text sizes in rem

Many people make their browser's text bigger so they can read easily. Sizes in `rem` grow with that setting. Sizes in `px` ignore it, and those visitors are stuck with text that's too small for them. So use:

- **`rem`** for text sizes;
- **`px`** for thin things that shouldn't grow, like borders;
- **`%`** when a box should follow the space it's in.

```css
h1 {
  font-size: 2rem; /* 32px, more if the visitor asks for more */
}
.note {
  font-size: 0.8em; /* a bit smaller than the text around it */
}
```

## Pictures that fit a phone

Your divider is 600 pixels wide. On a phone, the window is about 375 pixels wide, so the picture sticks out and the whole page scrolls sideways. A size in `%` fixes it:

```css
img {
  max-width: 100%;
  height: auto;
}
```

`max-width: 100%` means: never wider than the box it's in. `height: auto` means: shrink the height together with the width, so the picture keeps its shape. The `width` and `height` you wrote in the HTML still keep the picture's space while it loads.

---

## Mission: Readable Sizes

Some of the crew have weak eyes, so they set their browser's text bigger. Your page has to grow with that setting.

- Make the page's text a bit bigger than the browser's normal 16 pixels, and the headings bigger still: the biggest heading at least twice the normal size, the section headings in between. All of them grow when a visitor makes their text bigger.
- The address a little smaller than the text around it, whatever size that text is.
- On a phone, nothing sticks out: pictures shrink to fit, and keep their shape.
