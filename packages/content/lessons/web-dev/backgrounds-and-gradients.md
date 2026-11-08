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

- `url(...)` names the file, its path read **from the style sheet**, not from the page. Your `style.css` sits next to `img`, so `img/station.svg` works from it.
- `background-size: cover` scales the picture to cover the whole box, cutting what sticks out; `contain` fits it whole inside, leaving room.
- `background-position: center` decides which part stays in view.
- A background picture repeats like tiles unless told `no-repeat`.

A background picture is decoration: a screen reader doesn't know it's there, and there's no `alt`. A picture that means something belongs in an `<img>`.

## Gradients

```css
.panel {
  background-image: linear-gradient(90deg, #13294f, #2c4a7a);
}
```

A gradient is a picture CSS paints itself, so it goes in `background-image`. `linear-gradient` blends along a line: the angle first (`90deg` left to right, `180deg` top to bottom), then the colors, two or more. `radial-gradient` blends out from a center instead.

Keep text readable over a background: check the contrast where the text sits, at its darkest and its lightest.

---

## Mission: Banner

- On `schedule.html`, right after the intro paragraph, add an empty `div` in the class `banner`.
- The banner is `160px` tall, shows `img/station.svg` covering it, centered, and has corners rounded `16px`.
- The flights table's header cells get a background of `linear-gradient(90deg, #13294f, #2c4a7a)`.
