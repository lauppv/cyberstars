Some people can't read small text easily, so they set their phone or browser to show all text bigger. Grandparents often do. A good page grows with that setting. A page whose sizes are all in pixels doesn't: 18 pixels stays 18 pixels, whatever the visitor asked for.

## `rem`

`rem` is a size that follows the visitor's setting. `1rem` is "the normal text size of this browser":

- for most people that's 16 pixels, so `1rem` is 16 pixels;
- for someone who set "large text", it may be 20 or 24 pixels, and `1rem` is that.

Other sizes are multiples of it:

```css preview
<style>
  /* show */
  p {
    font-size: 1.125rem;
  }

  h1 {
    font-size: 2.5rem;
  }
  /* /show */
</style>
<h1>My Favourite Games</h1>
<p>We keep them in the cupboard by the window.</p>
```

With the usual 16-pixel setting:

- the paragraphs are 16 × 1.125 = **18 pixels**;
- the heading is 16 × 2.5 = **40 pixels**.

Exactly what you had before. But for someone whose setting is 24 pixels, the paragraphs become 27 pixels and the heading 60, and the page keeps its proportions.

## Pixels or rem?

For **text sizes**, use `rem`, so the page respects what each visitor needs.

Pixels are still fine for small, fixed things that don't need to grow with the text, like a thin line or a picture's width.

To turn a pixel size into rem, divide by 16: 40 pixels is 40 ÷ 16 = `2.5rem`.

## Break it on purpose

Write a rem size in pixels' place and forget to divide:

```css preview
<style>
  /* show */
  p {
    font-size: 18rem;
  }
  /* /show */
</style>
<h1>My Favourite Games</h1>
<p>We keep them in the cupboard by the window.</p>
```

18 times the normal size: each letter is nearly 300 pixels tall, and a single word fills the screen. `rem` counts in "normal text sizes", not pixels.

---

## Mission: Text that grows

Your sizes are in pixels. Some visitors set their browser to show bigger text, and your page ignores them.

**Example**: with the browser's usual setting the page looks as it does now. With a bigger setting, all its text grows.

- Every paragraph is between `1rem` and `1.25rem`.
- The biggest heading is at least `2rem`.
- Both follow the visitor's setting, so they're written in `rem`.

Psst, divide by 16 to turn pixels into rem :)
