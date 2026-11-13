A picture of a red, round sign with a white bar means "no entry". Everyone who sees it understands. Someone who can't see it needs the words. Sometimes a page shows something only with a picture or a short word, and a screen reader needs a whole sentence. You can write that sentence for screen readers only.

## Hiding from the eye, not from the screen reader

You know two ways to hide something:

- `display: none` hides it from **everyone**: the eye and the screen reader.
- `aria-hidden="true"` hides it from **screen readers** only.

What we need now is the third way: hidden from the **eye** only, still read out loud.

## The visually hidden class

There is no single property for it. Instead, a few properties together make the text so small that nothing shows, while it's still on the page for a screen reader:

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
```

Line by line:

- `position: absolute` takes it out of the flow, so it takes no room and moves nothing.
- `width` and `height` of 1 pixel make its box tiny.
- `overflow: hidden` hides the words that don't fit in that box, which is all of them.
- `clip-path: inset(50%)` cuts away even that last pixel.
- `white-space: nowrap` keeps the words on one line, so a screen reader doesn't read them oddly.

You'll find this class, or one very like it, on many websites. People usually call it `visually-hidden` or `sr-only` ("screen reader only").

## Using it

Put the sentence for screen readers in a `<span>` with the class:

```html preview
<style>
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
<p>Price: 12 € <span class="visually-hidden">, down from 15 €, for this week only</span></p>
```

The page shows "Price: 12 €". A screen reader says the whole sentence, with the old price and the offer.

## Break it on purpose

Use `display: none` in the class. Nothing shows, which looks right, but the screen reader doesn't read the sentence any more either: you've hidden it from everyone. Then remove `overflow: hidden` and `clip-path`: the box is still 1 pixel, but the words spill out of it, over the rest of the page. Each line of the class has a job.

---

## Mission: Live, in words

The LIVE label is clear to the eye, next to the camera. Read out alone, "LIVE" doesn't say what is live.

**Example**: the page shows only `LIVE`, as before. A screen reader reads something like "LIVE: the camera films the pad right now".

- Inside the LIVE label, after its word, a sentence of your own in an element with the class `visually-hidden`, which a screen reader still reads.
- The eye sees only `LIVE`: the sentence takes no room on the page, nothing of it shows, and its words don't spill out. Nothing sticks out sideways, on a phone too.

Psst, `display: none` hides it from the screen reader too :)
