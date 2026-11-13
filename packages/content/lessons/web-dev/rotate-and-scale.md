A steering wheel turns, but it stays in its place. A balloon grows bigger as you blow into it, and it's still where it was. Besides moving a box, `transform` can turn it and make it bigger or smaller.

## `rotate()`

`rotate()` turns a box round its middle, by an angle in degrees, `deg`. A whole turn is 360 degrees, so a quarter turn is 90:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .card {
    background-color: #1e3a5f;
    display: inline-block;
    padding: 16px;
    margin: 24px;
  }

  /* show */
  .tilted {
    transform: rotate(15deg);
  }
  /* /show */
</style>
<p class="card">Straight</p>
<p class="card tilted">Tilted</p>
```

The second card leans to the right, like a photo stuck on a wall in a hurry. A minus angle, `rotate(-15deg)`, turns it the other way.

## `scale()`

`scale()` makes a box bigger or smaller. `1` is its own size, `1.5` is one and a half times, `0.5` half:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .card {
    background-color: #1e3a5f;
    display: inline-block;
    padding: 16px;
    margin: 24px;
  }

  /* show */
  .big {
    transform: scale(1.5);
  }
  /* /show */
</style>
<p class="card">Normal</p>
<p class="card big">Big</p>
```

Everything in the box grows: the text, the padding, the background. It grows round its middle, and as with `translate`, the boxes around it don't move to make room.

## Turning on hover

Like `translate`, a rotation can come slowly with a transition:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  button {
    font-size: 1.5rem;
    padding: 8px 16px;
  }

  /* show */
  .gear {
    display: inline-block;
    transition: transform 0.4s;
  }

  button:hover .gear {
    transform: rotate(180deg);
  }
  /* /show */
</style>
<button type="button"><span class="gear">⚙</span> Settings</button>
```

Point at the button: the gear turns half a turn. Look at `display: inline-block` on the gear.

## Break it on purpose

Remove `display: inline-block` from `.gear`. Point at the button again: nothing turns. A `<span>` is inline, a piece of a line of text, and a transform doesn't work on that. As an `inline-block`, it's a small box of its own, which can turn. The browser shows no error: the transform is simply ignored.

---

## Mission: Lively theme buttons

The theme buttons on the settings page could show which one is chosen even more clearly, and feel alive under the mouse.

**Example**: point at the Light button: its sun turns. Point at Dark: its moon turns. The pressed button, System, is a little bigger than the others.

- Under the mouse, the icon of a theme button turns, by an angle of your own, and turns back when the mouse leaves. The button itself doesn't turn.
- The pressed theme button is 10% bigger than its own size, whichever button is pressed in the HTML.
- The buttons that aren't pressed keep their size.

Psst, an icon in a `<span>` needs to be a box before it can turn :)
