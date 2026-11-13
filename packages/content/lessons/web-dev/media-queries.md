You have one rule for the weather: if it rains, you take an umbrella. On a sunny day, the rule is still there, it just doesn't do anything. CSS can have rules like that too: rules for a narrow window, which do nothing on a wide one.

## `@media`

`@media` holds CSS rules that count only when its question is true. `(max-width: 500px)` asks: is the window at most 500 pixels wide?

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .box {
    background-color: #1e3a5f;
    padding: 16px;
    margin: 0;
  }

  /* show */
  .box {
    color: #7bd389;
  }

  @media (max-width: 500px) {
    .box {
      color: #ffd166;
    }
  }
  /* /show */
</style>
<p class="box">What color am I?</p>
```

Make your preview's panel wide: the text is green. Make it narrow, under 500 pixels: the text turns yellow. Inside the `@media`, the rule for `.box` comes later than the first one, so when the question is true, it wins.

Look at the braces: the `@media` has its own `{ }`, and the rules go inside them, each one with its own `{ }` as always.

## A layout for a narrow window

The most useful rules to change are the layout's. Two columns on a wide window, one on a narrow window:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .news,
  .weather {
    background-color: #1e3a5f;
    padding: 16px;
    margin: 0;
  }

  /* show */
  .page {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 12px;
  }

  @media (max-width: 500px) {
    .page {
      grid-template-columns: 1fr;
    }
  }
  /* /show */
</style>
<div class="page">
  <p class="news">The school play is on Friday at 6 pm. Everyone is welcome!</p>
  <p class="weather">Sunny, 21 °C</p>
</div>
```

On a narrow window, the grid gets one column, so the weather goes under the news. Inside the `@media` we only wrote what changes: the grid itself, its gap and the rest stay.

A phone shows your page at its own width only if the page has the viewport tag you know from the Station Wiki. Without it, the phone pretends to be a wide screen, and your `@media` never counts.

## Break it on purpose

Write `@media (max-width: 500)`, without `px`. The question has no meaning without a unit, so the browser skips the whole `@media`: on a narrow window, nothing changes. Then write the `@media` **before** the first `.page` rule. Now the first rule comes later and wins every time, so the narrow layout never shows. A media query goes after the rules it changes.

---

## Mission: Panels on a narrow window

In a window 600 pixels wide, the pad camera and the last launch share a narrow row, and everything gets squeezed.

**Example**: in a window 600 pixels wide or narrower, the four panels stand one under the other, each one as wide as the page:

```text
The launch pad, live
The last launch
The countdown
On duty today
```

- In a window 600 pixels wide or narrower, the panels stand one under the other, in this order: the pad camera, the last launch, the countdown, who is on duty. Each one is as wide as the box of panels.
- In a window 600 and 560 pixels wide, nothing sticks out sideways.
- In wider windows, the panels stay side by side as before.

Psst, 600 pixels or narrower is `max-width` :)
