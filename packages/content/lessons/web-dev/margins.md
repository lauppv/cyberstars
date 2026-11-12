Photos hung edge to edge on a wall look like one big messy picture. Leave some empty wall between them and each one stands on its own. That empty wall is the last layer of the box: the **margin**.

## `margin`

`margin` is space **outside** the box, between its border and the next element:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
  }

  /* show */
  .member {
    background-color: #1e3a5f;
    padding: 16px;
    margin: 24px;
  }
  /* /show */
</style>
<div class="member">
  <h3>Sam Green</h3>
  <p>Plays chess on Sundays.</p>
</div>
<div class="member">
  <h3>Lea Park</h3>
  <p>Runs the card games.</p>
</div>
```

Now there are 24 pixels of empty space around each member box, on every side. Two boxes one under the other stand apart.

The four layers, from the inside out:

1. the **content**: the text or picture itself;
2. the **padding**: room inside, in the box's background;
3. the **border**: the frame;
4. the **margin**: empty space outside, always see-through.

## Padding or margin?

Both make space, so which one do you need? Ask: should the space have the box's color?

- Room between the text and the box's own edge: **padding**, inside, colored.
- Room between this box and the next: **margin**, outside, empty.

## Break it on purpose

Try to separate the cards with padding instead:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
  }

  .member {
    background-color: #1e3a5f;
  }

  /* show */
  .member {
    padding: 40px;
  }
  /* /show */
</style>
<div class="member">
  <h3>Sam Green</h3>
  <p>Plays chess on Sundays.</p>
</div>
<div class="member">
  <h3>Lea Park</h3>
  <p>Runs the card games.</p>
</div>
```

The cards get bigger, with lots of blue around the text, but they still touch each other. Padding is inside the box: it can never push two boxes apart.

---

## Mission: Room between the cards

Your crew cards are framed, but they're stacked right on top of each other.

**Example**: there's a clear gap between each card and the next, showing the page's night blue.

- There are at least 16 pixels between each card and the next one.

Psst, the space between boxes is outside them :)
