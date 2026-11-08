A background can be more than a color: a picture, or a **gradient**, colors blending into each other.

## A picture behind

```css
.hangar {
  background-image: url("img/hangar.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

- `url(...)` names the file. Its path is read **from the style sheet**, not from the page. Your `style.css` sits next to the `img` folder, so `img/station.svg` works from it.
- `background-size: cover` makes the picture big enough to cover the whole box, and cuts off what sticks out. `contain` fits the whole picture inside, and leaves empty space.
- `background-position: center` decides which part of the picture stays in view.
- A background picture repeats like tiles, unless you say `no-repeat`.

A background picture is only decoration: a screen reader doesn't know it's there, and it has no `alt`. A picture that means something belongs in an `<img>`.

## Gradients

```css
.panel {
  background-image: linear-gradient(180deg, #ff8a00, #e52e71);
}
```

A gradient is a picture that CSS paints by itself, so it goes in `background-image`. `linear-gradient` blends colors along a line: first the angle (`90deg` is left to right, `180deg` is top to bottom), then two or more colors. `radial-gradient` blends outwards from a center instead.

Keep text readable on top of a background: check the contrast where the text is, at the darkest and the lightest part.

---

## Mission: Banner

The schedule page gets a banner at the top, like the big screen over a spaceport's gates.

- On `schedule.html`, right after the introduction paragraph, add an empty box in the class `banner`.
- The banner shows `img/station.svg` as its background, covering the whole banner without stretching, with the middle of the picture in view. It's between `120px` and `240px` tall, and its corners are rounded.
- The flights table's header cells get a gradient as their background, in colors of your choice.
