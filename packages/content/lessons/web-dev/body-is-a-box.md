Open a news site on a big computer screen. The text doesn't run from one edge of the screen to the other: it sits in a column in the middle, with empty space on both sides. Lines 2 metres long would be impossible to read. That column is the page's `body`, given a width.

## The body is a box too

`<body>` is an element like any other, so it's a box like any other. It has:

- a width: by default the whole window;
- a margin: browsers give it 8 pixels all round, which is why nothing touches the window's edge. Inspect it to see.

And everything you learned about boxes works on it.

## A column in the middle

```css
body {
  max-width: 800px;
  margin: 0 auto;
}
```

On a wide screen, the whole page sits in a column 800 pixels wide, in the middle. On a phone, it takes the full width. The same pair as before: a `max-width`, and `auto` margins left and right.

What about the background? A background on the `body` still covers the whole window, not just the column. Browsers treat the body's background as the page's.

## Some room on a phone

With `margin: 0 auto`, the body's left and right margins are 0 on a narrow phone, so the text touches the screen's edges. Add some padding inside:

```css
body {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}
```

## Break it on purpose

Give the body `width: 800px` instead of `max-width`. On a big screen it looks the same. On a phone, the page is 800 pixels wide and slides sideways. On the body above all, `max-width` is what you want.

---

## Mission: A column for every page

On a wide screen, your pages' lines run across the whole window.

**Example**: on a screen 1600 pixels wide, every page sits in a column in the middle, no wider than 960 pixels. On a phone, it still fits without sliding sideways.

- On a screen 1600 pixels wide, the page's body is at most 960 pixels wide.
- It's centered in the window.
- On a phone 320 pixels wide, nothing slides sideways.

Psst, this goes on the `body`, so every page gets it :)
