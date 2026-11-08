A page of words is a start. Now your station gets a picture.

## The image element

An image is an `img` element. Like `<br>` it holds nothing, so it has no closing tag; everything it needs sits in its attributes:

```html
<img src="img/crate.svg" alt="A wooden crate with a red cargo stamp" width="160" height="120" />
```

- `src`, the **source**, says which file to show. `img/crate.svg` is a **path**: the file `crate.svg` in the folder `img`, next to the page. You'll learn more about paths in the next part.
- `alt` is the **alternative text**: what the picture shows, in words.
- `width` and `height` are its size in pixels.

Look at the files of your site: this lesson brought a folder `img` with two pictures, `station.svg` and `divider.svg`. They come with the course, so you can use them but not change them. Pictures of your own will come later.

## Why alt matters

A screen reader can't see a picture; it reads its `alt` aloud. A search engine reads it to learn what the picture is about. And when a picture doesn't load, a slow connection, a wrong path, the browser shows the `alt` in its place.

Good alt text says what the picture shows, as you'd tell it to someone on the phone: **A gold hub with two solar panels**, not **image** or **station.svg**.

Some pictures are only decoration: a line, a flourish, a pattern. Telling a blind visitor "decorative line" every time helps nobody. Give them an **empty** alt, `alt=""`: a screen reader then skips the picture. Leaving `alt` out is not the same: then a screen reader may read the file's name instead.

## Width and height

The browser learns a picture's size only once the file arrives. Without `width` and `height` it gives the picture no room at first, then pushes the text down when it loads, just as the visitor starts reading. Write the picture's real size, and the room is kept from the start.

An image is inline, like a link: it sits in a line of text unless it's alone between blocks.

---

## Mission: Station Portrait

- Right under your biggest heading, show `img/station.svg`. It is 320 pixels wide and 200 tall: say so. Describe what it shows in your own words.
- Between the end of **About the Station** and the heading **Today on Board**, show `img/divider.svg`. It's only decoration.
