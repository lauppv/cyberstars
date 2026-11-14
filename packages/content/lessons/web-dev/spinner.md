You open a video on your phone, and for a second it isn't there yet. What do you see? A small circle that turns. It tells you: "I'm working on it, don't leave." Without it you would think the phone froze. Today you'll make that circle yourself, with only CSS.

## A ring with one colored side

A spinner is a ring that turns. You already know every piece of it:

- a box as wide as it is tall,
- a border all around it,
- corners rounded so much that the box becomes a circle (`border-radius: 50%`),
- and one side of the border in another color, so you can see it turn.

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  /* show */
  .loader {
    width: 40px;
    height: 40px;
    border: 5px solid #1e3a5f;
    border-top-color: #ffd166;
    border-radius: 50%;
  }
  /* /show */
</style>
<div class="loader"></div>
```

What do you see? A dark ring, with its top quarter in yellow. `border` gives all four sides the same border, then `border-top-color` changes only the color of the top one. The order matters: written before `border`, it would be overwritten.

## Make it turn

Now the animation you know from the settings page: `@keyframes` with `rotate()`, and `infinite` so it never stops. A spinner turns at the same speed all the time, so its timing is `linear`:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  /* show */
  .loader {
    width: 40px;
    height: 40px;
    border: 5px solid #1e3a5f;
    border-top-color: #ffd166;
    border-radius: 50%;
    animation: turn 1s linear infinite;
  }

  @keyframes turn {
    to {
      transform: rotate(360deg);
    }
  }
  /* /show */
</style>
<div class="loader"></div>
```

The ring turns once every second, forever. A keyframes rule with only `to` starts from how the element looks anyway, here not turned at all.

Change `linear` to `ease` and look again: now it slows down at the end of every turn, as if it got tired. That's why spinners use `linear`.

## A spinner in a line of text

A spinner often sits in front of a text, like "Loading...". A `<span>` fits in a line, but a span is inline: it ignores `width` and `height`. `display: inline-block` makes it a box that still sits in the line:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  /* show */
  .loader {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 3px solid #1e3a5f;
    border-top-color: #ffd166;
    border-radius: 50%;
    vertical-align: middle;
    animation: turn 1s linear infinite;
  }
  /* /show */

  @keyframes turn {
    to {
      transform: rotate(360deg);
    }
  }
</style>
<!-- show -->
<p><span class="loader" aria-hidden="true"></span> Loading the video...</p>
<!-- /show -->
```

The span is only for the eye, so `aria-hidden="true"` keeps a screen reader from meeting it. The words "Loading the video..." already say everything.

## Break it on purpose

Remove `display: inline-block;` from the last example. The spinner becomes a thin sliver: the span has no width and height of its own any more, only its borders. Then remove `border-radius: 50%;`: a square turns, which looks like a broken fan more than a spinner.

---

## Mission: The tracker is working on it

The tracker's loading line only says it's loading. A turning spinner in front of it would show that the page is really working.

**Example**: the line now starts with a small ring, about as big as the letters, with one side in another color, that turns round and round in front of `Loading the starships...`.

- In the paragraph `tracker-status`, before its text, an element with the class `spinner` that only the eye meets.
- The spinner is a round ring, a border of at least 2px all around it, between 16px and 48px wide and tall, with one side in another color.
- It turns round and round, and never stops on its own.
- It stands still for a visitor who asks for less motion: on their device, or with Less on the settings page.

Psst, a span ignores `width` and `height` until it is an inline block :)
