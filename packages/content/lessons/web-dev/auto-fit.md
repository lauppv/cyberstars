Put chairs along the wall of a room. In a big room, six fit in a row. In a small one, only three, and the others go in a second row. You don't decide the number: the wall does. A grid can decide how many columns it has the same way, by the room it has.

## `auto-fit`

In `repeat()`, the number can be the word `auto-fit`: as many columns as fit. It needs a size that says how wide a column must be, so `minmax()` comes with it:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .photo {
    background-color: #1e3a5f;
    padding: 24px 8px;
    margin: 0;
    text-align: center;
  }

  /* show */
  .album {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 8px;
  }
  /* /show */
</style>
<div class="album">
  <p class="photo">Beach</p>
  <p class="photo">Birthday</p>
  <p class="photo">Snow day</p>
  <p class="photo">Concert</p>
  <p class="photo">Garden</p>
  <p class="photo">Museum</p>
</div>
```

Read it as: as many columns as fit, each at least 150 pixels and at most one share. Make your preview's panel wider and narrower and watch: the number of columns changes by itself, and the photos always fill the row. In a panel narrower than two photos, it's one column.

How does the grid count? It fits as many 150-pixel columns as it can, with the gaps between them. Then `1fr` shares out the room left, so the row ends at the right edge.

## Without `minmax()`

Give `auto-fit` a plain size, `repeat(auto-fit, 150px)`. The number of columns still changes with the width, but every column stays exactly 150 pixels, and the room left is an empty strip on the right. `minmax(150px, 1fr)` is what lets the columns grow to fill the row.

## Break it on purpose

Use the smallest size alone, without `auto-fit`: `repeat(3, minmax(150px, 1fr))`. Now it's always three columns. On a narrow screen, three times 150 pixels doesn't fit, and the row sticks out. The smallest size keeps its promise, and only `auto-fit` can give up a column to keep it.

---

## Mission: Cards for every width

In a window 800 pixels wide, your three columns of cards are getting narrow. Two columns would look better there.

**Example**: on a computer, three columns of cards, as now. In a window 800 or 600 pixels wide, two columns: the crew's card on the left over two rows, Oxygen and Water on the right, then the Next launch card across both columns:

```text
Crew on board    Oxygen
                 Water
Next launch (two columns)
Power            Days in orbit
```

- The cards take as many columns as fit, each column at least 260 pixels wide, and the columns fill the whole width of `.stats`.
- On a computer, that's three columns. In windows 800, 700 and 600 pixels wide, it's two.
- The crew's card and the Next launch card keep their places, and nothing sticks out sideways.

Psst, `auto-fit` takes the place of the number in `repeat()` :)
