Open a website on your phone and drag it sideways by accident: if the page slides left and right, something on it is wider than the screen. It's usually a picture. A picture 600 pixels wide simply doesn't fit on a phone 360 pixels wide.

## `max-width: 100%`

`max-width` is the most a width can be. With `100%`, the most is "as wide as the space it's in":

```css
img {
  max-width: 100%;
}
```

- on a wide screen, the picture shows at its own size, since it already fits;
- on a narrow phone, it shrinks to the width of the screen, never wider.

`%` is a new unit: a share of the space around. `100%` is all of it, `50%` half of it.

## Keep the shape: `height: auto`

There's a catch. Your pictures have a `height` in the HTML. When the picture gets narrower, the height stays the same, and the picture gets squashed. Fix it with:

```css
img {
  max-width: 100%;
  height: auto;
}
```

`height: auto` means "work out the height from the width", so the picture shrinks in its own shape. The `width` and `height` in the HTML still do their first job: they tell the browser the picture's shape before it loads, so the text doesn't jump.

## Trying it

Your preview is as wide as its panel, so make the panel narrow and see the pictures shrink. Many browsers can also show a page at a phone's width: you'll learn how later in the course.

## Break it on purpose

Use `width: 100%` instead of `max-width`:

```css
img {
  width: 100%;
}
```

Now **every** picture stretches to the full width, even a small one, which gets blurry and huge. `max-width` only shrinks what's too big, and leaves the rest alone.

---

## Mission: Pictures on a phone

On a phone, your divider is wider than the screen, and the page slides sideways.

**Example**: on a screen 320 pixels wide, both pictures fit, in their own shape, and nothing slides sideways.

- On a screen 320 pixels wide, the page has nothing to scroll sideways.
- The pictures shrink to fit and keep their shape.

Psst, `max-width` shrinks, `height: auto` keeps the shape :)
