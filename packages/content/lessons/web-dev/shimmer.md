Look at a wet road at night when a car passes: a band of light slides over it, and you know something is moving there. Skeleton cards on many apps do the same. A soft light slides over the grey blocks, so they don't look frozen. It says: "this is alive, the cards are on their way."

## A gradient as the light

A light band is a gradient that goes from nothing, to a little white, back to nothing. `transparent` is a color you can see through, so the grey of the block shows on both sides:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  /* show */
  .block {
    height: 64px;
    border-radius: 8px;
    background-color: #1e3a5f;
    background-image: linear-gradient(90deg, transparent, rgb(255, 255, 255, 0.25), transparent);
  }
  /* /show */
</style>
<div class="block"></div>
```

What do you see? A dark blue block, lighter in its middle. The gradient lies on top of the background color.

## Make the light move

A light that stands still isn't much. To move it, two more properties:

- `background-size: 200% 100%` makes the gradient twice as wide as the block, so only part of it shows at a time.
- `background-position` says where the gradient lies. An animation can change it, like any other number.

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  /* show */
  .block {
    height: 64px;
    border-radius: 8px;
    background-color: #1e3a5f;
    background-image: linear-gradient(90deg, transparent, rgb(255, 255, 255, 0.25), transparent);
    background-size: 200% 100%;
    background-repeat: no-repeat;
    animation: shimmer 1.5s linear infinite;
  }

  @keyframes shimmer {
    from {
      background-position: 200% 0;
    }

    to {
      background-position: -100% 0;
    }
  }
  /* /show */
</style>
<div class="block"></div>
```

The light now slides across the block, from left to right, every second and a half. `background-repeat: no-repeat` keeps the gradient from repeating, so there's only one band. The two numbers after `background-position` are left and top: only the first one changes here.

Moving light is still movement. A visitor who asked for less motion gets the grey blocks without it, as with the spinner.

## Break it on purpose

Remove `background-size: 200% 100%;`. The animation runs, but you see nothing move: a gradient as wide as the block fills it exactly, and there's no room to slide it. Then remove `background-repeat: no-repeat;`: two bands chase each other, since the gradient repeats.

---

## Mission: Alive while waiting

The tracker's skeleton cards stand still. A light that moves over them would show the page is alive.

**Example**: a soft, lighter band slides over each skeleton card, again and again, without end. The cards are still grey blocks.

- Every skeleton card has a gradient on its background, and an animation moves it over the card, round and round, without end.
- The cards are still at least 60px tall, with a background that stands out from the page's.
- The light stands still for a visitor who asks for less motion: on their device, or with Less on the settings page.

Psst, a gradient as wide as the card has no room to move :)
