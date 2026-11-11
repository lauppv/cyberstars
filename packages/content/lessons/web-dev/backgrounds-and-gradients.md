The big screen over an airport's gates often shows a picture behind its words: a sky, a city, the airline's plane. The picture isn't part of the information. It's a **background**, and CSS can put one behind any box.

## `background-image`

```css
.banner {
  background-image: url("img/sky.svg");
  height: 160px;
}
```

`url(...)` says which picture, with a path like an `<img>`'s `src`. The path starts from the **style sheet**, not from the page.

An empty `div` with this class shows the picture as its background, 160 pixels tall. The picture doesn't need to be in the HTML at all.

## Size and position

By default, a background shows at its own size, starting at the top left corner, and repeats like tiles to fill the box. Usually you want something else:

```css
.banner {
  background-image: url("img/sky.svg");
  background-size: cover;
  background-position: center;
  height: 160px;
}
```

- `background-size: cover`: grow or shrink the picture until it **covers** the whole box, keeping its shape. Some of its edges may be cut off;
- `background-position: center`: keep the middle of the picture in view.

`background-size: contain` is the opposite of `cover`: the whole picture fits inside the box, with empty space around it if needed.

## Pictures with a meaning

A background has no `alt`: a screen reader skips it. So a picture that carries information, like a map or a photo of someone, goes in an `<img>`. Backgrounds are for decoration.

## Break it on purpose

Leave out the height on an empty box: it's 0 pixels tall, so its background has nowhere to show. A box with only a background needs a size.

---

## Mission: A banner

The schedule page gets a banner at the top, like the big screen over a spaceport's gates.

**Example**: under the schedule's introduction, a wide banner shows the station picture, filling the banner without being stretched, with the middle of the station in view.

- Right after the introduction paragraph, an empty `div` with the class `banner`.
- Its background is `img/station.svg`, covering the whole banner, centered.
- It's between 120 and 240 pixels tall.

Psst, the path in `url()` starts from `style.css` :)
