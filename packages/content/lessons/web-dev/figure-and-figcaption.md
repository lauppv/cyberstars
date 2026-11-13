Look at a photo in a newspaper or a school book. Under it there's a short line in small letters: who is in the photo, or where it was taken. The photo and its line belong together. If the page moves the photo, the line goes with it. HTML has a pair of tags for exactly that.

## `<figure>`

A **figure** is a picture, a video or a drawing that comes with its own line of text. `<figure>` holds them together:

```html preview
<figure>
  <img src="img/station.svg" alt="A gold station hub inside a blue ring" width="240" height="150" />
</figure>
<p>The station goes round the Earth every 92 minutes.</p>
```

The picture moved to the right, and there's room above and below it. Those are the browser's own styles for a figure: a margin on every side. Your CSS can change them, like for any box.

## `<figcaption>`

`<figcaption>` is the figure's line of text, its **caption**. It goes inside the `<figure>`, first or last:

```html preview
<figure>
  <img src="img/station.svg" alt="A gold station hub inside a blue ring" width="240" height="150" />
  <figcaption>The station, seen from a supply ship.</figcaption>
</figure>
```

The caption shows under the picture. It looks like a plain line of text, but now the browser knows it's **about** this picture. A screen reader reads the two together, so someone who can't see the picture still knows what the caption is about.

The caption doesn't replace `alt`. `alt` says what the picture shows, for people who can't see it. The caption adds something everyone reads: who, where, when.

## A video is a figure too

The same works for a video:

```html preview
<figure>
  <video src="video/launch.webm" controls></video>
  <figcaption>A rocket leaves the pad at sunset.</figcaption>
</figure>
```

## Break it on purpose

Write the caption as a `<p>` instead of `<figcaption>`. The page looks the same. But for the browser it's now just one more paragraph in the figure, not the figure's caption, and a screen reader no longer reads it with the picture. As with `<header>` and `<nav>`, the right tag tells what a part **is**, even when you can't see it.

Then move the `<figcaption>` out, after `</figure>`. A caption outside a figure belongs to nothing: it's a line of text on its own, far from its picture.

---

## Mission: A caption for the launch

The launch video on the dashboard has a heading over it, but nothing says which flight it shows or where it was filmed from.

**Example**: on the dashboard, the launch video, a bit away from the side of the page, with a line under it such as "Flight SL-101 leaves the pad for Moon Base, filmed from the launch tower."

- The launch video (`#launch-video`) and a caption of your own about it are one figure, in the main part of the dashboard.
- The launch video still has its buttons and its words, and waits for a click on play.
- The pad camera and the countdown work as before.

Psst, the caption goes inside the `<figure>`, before `</figure>` :)
