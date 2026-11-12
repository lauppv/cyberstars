Look at the sky at sunset: orange near the horizon, fading into purple, then dark blue. No sharp line anywhere, just one color melting into the next. That's a **gradient**, and CSS can draw one, with no picture file at all.

## `linear-gradient`

A gradient is used like a background picture:

```css preview
<style>
  .header {
    padding: 16px;
    color: white;
  }

  /* show */
  .header {
    background-image: linear-gradient(orange, purple);
  }
  /* /show */
</style>
<div class="header">
  <h1>Night Owls</h1>
</div>
```

From orange at the top to purple at the bottom, melting in between.

Add a direction first, and more colors:

```css preview
<style>
  .header {
    padding: 16px;
    color: white;
  }

  /* show */
  .header {
    background-image: linear-gradient(90deg, orange, purple, darkblue);
  }
  /* /show */
</style>
<div class="header">
  <h1>Night Owls</h1>
</div>
```

`90deg` turns it to go left to right instead of top to bottom: `0deg` is upwards, `90deg` to the right, `180deg` downwards. With three colors, it goes orange, then purple, then dark blue.

## `radial-gradient`

A radial gradient spreads from the middle outwards, in a circle:

```css preview
<style>
  .spotlight {
    padding: 40px;
    text-align: center;
    color: darkblue;
  }

  /* show */
  .spotlight {
    background-image: radial-gradient(white, darkblue);
  }
  /* /show */
</style>
<div class="spotlight">
  <p>Tonight's show</p>
</div>
```

White in the middle, fading out to dark blue at the edges, like a spotlight.

## Readable on top

A gradient changes color across the box, so text on it has a different background at each end. Check the contrast at the lightest and the darkest point, not just one.

## Break it on purpose

Write it as `background-color`:

```css preview
<style>
  .header {
    padding: 16px;
    color: white;
  }

  /* show */
  .header {
    background-color: linear-gradient(orange, purple);
  }
  /* /show */
</style>
<div class="header">
  <h1>Night Owls</h1>
</div>
```

Nothing shows. A gradient is a kind of **image**, so it goes in `background-image`, never in `background-color`.

---

## Mission: The board's header

The flight table's header row should look like the top of a departures board, with a glow.

**Example**: the header cells of the flight table (Flight, Destination, Departs, Status) stand on a gradient of your own colors, and their words are easy to read on it.

- The flight table's header cells have a gradient as their background.
- The flights' cells keep their own background, without the gradient.

Pick colors dark enough for the light words to read on them from one end to the other.

Psst, a gradient goes in `background-image` :)
