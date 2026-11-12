A suitcase for a plane has rules: no bigger than this, so it fits in the overhead bin. A gift box might have the opposite rule: at least this big, so the present fits. Boxes on a page can have rules like that too: grow with what you hold, but never past a size, or never under one.

## `max-width`: never wider

You already met it with pictures. On any box, `max-width` lets it be narrower, but never wider:

```css preview
<style>
  .notice {
    background-color: lightyellow;
  }

  /* show */
  .notice {
    max-width: 500px;
  }
  /* /show */
</style>
<p class="notice">The pool is closed on Monday for cleaning. On Tuesday it opens again at eight, with the water a little warmer than before.</p>
```

On a wide screen the notice stops at 500 pixels, so its lines don't get too long to read. On a phone narrower than that, it simply takes the phone's width. A fixed `width: 500px` would stick out of the phone instead.

That's the big difference: `width` is always that size, `max-width` is "that size at most".

## `min-height`: never shorter

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
  }

  .member {
    background-color: #1e3a5f;
    padding: 16px;
    margin-bottom: 16px;
  }

  /* show */
  .member {
    min-height: 120px;
  }
  /* /show */
</style>
<div class="member">
  <h3>Sam Green</h3>
  <p>Plays chess.</p>
</div>
<div class="member">
  <h3>Lea Park</h3>
  <p>Runs the card games on Fridays, and keeps the score of every game the club has played this year.</p>
</div>
```

Each member box is at least 120 pixels tall. A member with a short text gets a box of 120. A member with a long one gets a taller box that holds it all. Unlike `height`, the text never spills out.

That keeps a row of boxes looking even, even when their texts are different lengths.

`min-width` and `max-height` work the same way, for the other direction.

## Break it on purpose

Swap them: give the notice `min-width: 500px`. On a wide screen nothing changes. On a phone 360 pixels wide, the notice stays 500 and sticks out of the screen, and the whole page slides sideways. A rule meant to stop a box growing is `max`, one meant to stop it shrinking is `min`.

---

## Mission: Even cards, readable duties

On `crew.html`, a card with a long name or job is taller than the others, and the duty board's lines are as long as the whole page.

**Example**: every card is at least as tall as the others. The duty board stops growing at a comfortable width, but still fits a phone.

- Every card is at least 140 pixels tall.
- The duty list is at most 600 pixels wide.

Psst, `min` stops a box shrinking, `max` stops it growing. And remember what a width counts, padding or not :)
