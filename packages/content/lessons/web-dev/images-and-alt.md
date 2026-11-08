A page of words is a good start. Now your station gets a picture.

## The image element

A picture is an `img` element. Like `<br>`, it holds nothing, so it has no closing tag. Everything it needs goes in its attributes:

```html
<img src="img/crate.svg" alt="A wooden crate with a red cargo stamp" width="160" height="120" />
```

- `src`, the **source**, says which file to show. `img/crate.svg` is a **path**: the file `crate.svg` in the folder `img`, next to the page. You'll learn more about paths in the next part.
- `alt` is the **alternative text**: what the picture shows, in words.
- `width` and `height` are its size in pixels.

Look at the files of your site: this lesson added a folder `img` with two pictures, `station.svg` and `divider.svg`. They come with the course, so you can use them but not change them.

## Why alt matters

A screen reader can't see a picture, so it reads the `alt` out loud. A search engine reads it to learn what the picture is about. And when a picture doesn't load, because of a slow connection or a wrong path, the browser shows the `alt` in its place.

Good alt text says what the picture shows, the way you'd describe it to a friend on the phone: **A gold hub with two solar panels**, not **image** or **station.svg**.

Some pictures are only decoration: a line, a swirl, a pattern. Hearing "decorative line" again and again helps nobody. Give them an **empty** alt, `alt=""`, and a screen reader skips the picture. Leaving out `alt` completely is different: then a screen reader may read the file's name out loud instead.

## Width and height

The browser only knows how big a picture is once the file arrives. Without `width` and `height`, it gives the picture no space at first. Then, when the picture loads, it pushes the text down, just as the visitor starts reading. If you write the picture's real size, the space is kept from the start.

A picture is inline, like a link: it sits in a line of text, unless it's alone between blocks.

---

## Mission: Station Portrait

- Right under your biggest heading, show `img/station.svg`. Describe it for a visitor who can't see it, in your own words. The picture is 320 pixels wide and 200 tall, and the text under it shouldn't jump when it loads.
- Between the end of **About the Station** and the heading **Today on Board**, show `img/divider.svg`. It's only decoration, so a screen reader should skip it.
