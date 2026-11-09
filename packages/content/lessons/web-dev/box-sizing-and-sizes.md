A paragraph takes the whole width of the page, whatever its text. That's fine for long text. But a card for one person, stretched across a huge screen, looks like a banner. Sometimes a box needs a size of its own.

## `width` and `height`

```css
.member {
  width: 250px;
}
```

Each member box is now 250 pixels wide, however wide the page is. Its text wraps to fit.

`height` sets how tall a box is:

```css
.banner {
  height: 120px;
}
```

Use `height` with care. Most boxes should be as tall as what they hold, which is what they do by themselves. A fixed height on a box of text is a trap: write more text, and it no longer fits.

## Pixels or percent

`width` takes `%` too: a share of the space the box sits in.

```css
.member {
  width: 50%;
}
```

Half of the space around it, whatever the screen. On a wide screen the box is wide, on a phone it's narrow.

## Break it on purpose

Give a box of text a small height:

```css
.member {
  height: 30px;
}
```

The text doesn't shrink: it spills out under the box, over whatever comes next. The box is 30 pixels tall as you asked, and the text doesn't care. Take the height away, and the box grows to hold it again.

---

## Mission: Card size

Your cards stretch across the whole page. A card for one person doesn't need to be that wide.

**Example**: each card is narrower, about the width of a postcard, and its text wraps inside it.

- Every card is between 200 and 300 pixels wide.

Psst, leave the height alone: the card grows with its text :)
