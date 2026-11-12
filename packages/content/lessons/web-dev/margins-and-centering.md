Hang a picture in the middle of a wall: you measure the empty wall on the left and on the right, and make them equal. CSS can do that measuring for you.

## `margin: 0 auto`

A box with a width narrower than its space can be centered with `auto` margins on the left and right:

```css preview
<style>
  .notice {
    background-color: lightyellow;
  }

  /* show */
  .notice {
    max-width: 200px;
    margin: 0 auto;
  }
  /* /show */
</style>
<p class="notice">The pool is closed on Monday.</p>
```

`0 auto` is the two-value shorthand: `0` for the top and bottom, `auto` for the left and right. `auto` means "the browser works it out": it takes the space left over and shares it equally between the two sides. The box ends up in the middle.

On a phone, where there's no space left over, each `auto` is 0 and the box simply takes the full width.

## It needs a width

`auto` margins only center a box that's **narrower** than its space. A paragraph with no width takes the full width already, so there's nothing left over to share, and nothing moves:

```css preview
<style>
  .notice {
    background-color: lightyellow;
  }

  /* show */
  .notice {
    margin: 0 auto;
  }
  /* /show */
</style>
<p class="notice">The pool is closed on Monday.</p>
```

So it's always a pair: a `width` or `max-width`, and `margin: 0 auto`.

## Break it on purpose

Write `margin: auto 0` instead:

```css preview
<style>
  .notice {
    background-color: lightyellow;
  }

  /* show */
  .notice {
    max-width: 200px;
    margin: auto 0;
  }
  /* /show */
</style>
<p class="notice">The pool is closed on Monday.</p>
```

The notice sits on the left again. Now `auto` is on the top and bottom, and the left and right are 0. Two values: the first for top and bottom, the second for left and right.

---

## Mission: The duty board in the middle

Your duty board stops at 600 pixels, but it sits on the left with empty space on its right.

**Example**: on a wide screen, the duty board sits in the middle of the page, with as much empty space on its left as on its right.

- The duty list is centered across the page.

Psst, `auto` margins on the left and right share the space out :)
