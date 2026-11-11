Imagine you call a friend and describe a photo on your screen: "it's our cat, asleep in a shoebox". Your friend can't see it, but now they know what's in it.

Some people visit web pages without seeing them: they're blind, and a **screen reader** reads the page out loud. When it reaches a picture, what should it say? The page tells it, with the `alt` attribute.

## `alt`: the picture in words

```html
<img src="img/cat.svg" alt="A grey cat asleep in a shoebox" />
```

`alt` is short for **alternative**: words that take the picture's place when it can't be seen. A screen reader says "A grey cat asleep in a shoebox". And if the picture can't load, on a slow phone or with a wrong path, the browser shows the alt words where the picture should be.

Search engines read it too, to know what a picture shows.

## Good alt words

Write what you'd say to your friend on the phone. Short, and about what matters in the picture:

- good: `alt="A grey cat asleep in a shoebox"`
- not helpful: `alt="cat.svg"`, `alt="picture"`, `alt="image of a cat"`

There's no need to say "picture of": the screen reader already says it's a picture.

## A picture that's only decoration

Some pictures carry no meaning: a pretty line between two parts, a little star in a corner. Reading them out would just get in the way. For those, write an **empty** alt:

```html
<img src="img/line.svg" alt="" />
```

`alt=""` says "this is only decoration, skip it". It's different from no `alt` at all. With no `alt`, a screen reader may read out the file's name instead: "line dot s v g".

## Break it on purpose

Break the picture's path and look at the preview:

```html
<img src="img/kat.svg" alt="A grey cat asleep in a shoebox" />
```

Instead of the picture, you see a broken icon with the words "A grey cat asleep in a shoebox". The alt did its job. Now take the alt away too: the broken icon is all that's left, and nobody knows what was meant to be there. Fix the path again.

---

## Mission: Pictures in words

Your `index.html` shows the station's picture. There's also a new picture in your `img` folder, `divider.svg`: a thin line with a star, only for decoration.

**Example**: the page shows the station picture as before, and the divider line between two parts of the page.

- The station picture has `alt` words that say what it shows.
- The picture `img/divider.svg` shows between two of your parts, and has an empty `alt`.

Psst, an empty alt is `alt=""`, not no alt at all :)
