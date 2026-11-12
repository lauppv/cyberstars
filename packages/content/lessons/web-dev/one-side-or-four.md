A picture frame is often wider at the bottom than at the top, so the picture looks like it sits right. Boxes on a page are like that too: you don't always want the same room on every side.

## One side at a time

Every side has its own property:

```css preview
<style>
  .note {
    background-color: lightyellow;
  }

  /* show */
  .note {
    padding-top: 8px;
    padding-right: 16px;
    padding-bottom: 8px;
    padding-left: 40px;
  }
  /* /show */
</style>
<p class="note">Bring your own board on Saturdays: we only have six.</p>
```

Top, right, bottom, left, each with its own value. The same works for margins: `margin-top`, `margin-right`, `margin-bottom`, `margin-left`. Set only one side, and the others keep what they had.

## The short way

Writing four lines is long. `padding` and `margin` take several values at once:

```css
padding: 16px;                  /* all four sides */
padding: 8px 16px;              /* top and bottom 8, left and right 16 */
padding: 8px 16px 8px 40px;     /* top, right, bottom, left */
```

With four values, the order goes round the box like a clock's hands, starting at the top: top, right, bottom, left. A trick to remember it: **TRouBLe**, T-R-B-L.

With two values, the first is for top and bottom, the second for left and right.

## Break it on purpose

Mix up the order:

```css preview
<style>
  .note {
    background-color: lightyellow;
    /* show */
    padding: 40px 8px 16px 8px;
    /* /show */
  }
</style>
<p class="note">Bring your own board on Saturdays: we only have six.</p>
```

You wanted 40 on the left, but it's the first value, so it's the **top**: a big empty space above the text, and only 8 pixels on the left. When a side looks wrong, count round the clock: top, right, bottom, left.

---

## Mission: The duty board panel

The duty board on `crew.html` should look like a panel too. Its numbers sit on the left, so it needs more room there.

**Example**: the duty list stands on a panel of its own color, with a little room at the top and bottom and more on the left, where the numbers are.

- The duty list has a background the page doesn't have.
- It has at least 8 pixels of room inside at the top and at the bottom.
- It has at least 32 pixels of room inside on the left, and at most 24 on the right.

Psst, four values go round the clock: top, right, bottom, left :)
