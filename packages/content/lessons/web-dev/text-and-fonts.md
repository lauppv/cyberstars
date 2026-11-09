Look at a birthday card, a road sign and a comic book. The letters look completely different: curly, plain, hand-drawn. Each style of letters is a **font**, and the font changes how a page feels before anyone reads a word.

## `font-family`

`font-family` picks the font:

```css
body {
  font-family: Verdana;
}
```

The `body` holds everything you see, so everything on the page takes this font. You'll learn exactly why in a later lesson.

A font name with spaces goes in quotes: `font-family: "Times New Roman";`.

## A list, not one font

Here's the catch: a font only shows if the visitor's device has it. Verdana is on almost every computer, but not on every phone. If it's missing, the browser falls back to its own default, and your page looks different from what you planned.

So you give a **list**, best first:

```css
body {
  font-family: Verdana, Geneva, sans-serif;
}
```

The browser tries Verdana. If the device doesn't have it, it tries Geneva. If it has neither, it takes any `sans-serif` font it has.

The last word is a **generic family**, a kind of font every device has:

- `sans-serif`: plain letters, with no little feet at the ends, like this text;
- `serif`: letters with little feet, like in a printed book;
- `monospace`: every letter the same width, like code.

Always end your list with one of them. Then, whatever happens, the page gets the right **kind** of font.

## Break it on purpose

Pick a font almost nobody has, with no fallback:

```css
body {
  font-family: Papyrus;
}
```

On your computer it may look as you wanted. On a phone without Papyrus, the browser shows its default font instead, often a `serif` one, and your page looks like a newspaper. Add `, sans-serif` at the end and it falls back to the right kind.

---

## Mission: The station's fonts

Your page is still in the browser's default font.

**Example**: the paragraphs show in a plain font like Verdana, and the biggest heading in a font with little feet, like Georgia.

- The page's text is in a list of fonts that ends with `sans-serif`.
- The biggest heading is in a different font from the paragraphs.

Psst, a font name with spaces needs quotes :)
