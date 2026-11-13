Write a long sentence in your notebook. When the line ends, you go on at the start of the next line. You don't write the last words smaller and smaller to make them fit. A flex container does exactly that, unless you tell it to start a new line.

## One line, whatever happens

A flex container keeps all its items on one line. When they don't fit, it squeezes them:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .photo {
    background-color: #1e3a5f;
    padding: 8px;
    margin: 0;
    width: 110px;
  }

  /* show */
  .album {
    display: flex;
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
  <p class="photo">Picnic</p>
</div>
```

Each photo should be 110 pixels wide. But seven photos don't fit in the cell, so they all get narrower, and the name Snow day breaks onto two lines. A photo can't get narrower than its longest word, so on a phone the row sticks out sideways.

## `flex-wrap`

`flex-wrap: wrap` lets the items go on to a new line when there's no room left:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .photo {
    background-color: #1e3a5f;
    padding: 8px;
    margin: 0;
    width: 110px;
  }

  /* show */
  .album {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
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
  <p class="photo">Picnic</p>
</div>
```

Each photo keeps its 110 pixels. The ones that don't fit go on to the next line, and the gap goes between the lines too. Make the panel of your preview narrower or wider, and watch the photos move from line to line.

Without `flex-wrap`, you get `nowrap`: one line, whatever happens.

## Break it on purpose

Give `flex-wrap` to the photos instead of the album:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .photo {
    background-color: #1e3a5f;
    padding: 8px;
    margin: 0;
    width: 110px;
  }

  /* show */
  .album {
    display: flex;
    gap: 8px;
  }

  .photo {
    flex-wrap: wrap;
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
  <p class="photo">Picnic</p>
</div>
```

The photos are squeezed again. Wrapping decides where the items of a container go, so it goes on the container, like `display: flex` and `gap`.

---

## Mission: A new row when there's no room

Your cards stay in one row however narrow the screen is. On a phone they get squeezed, and the page sticks out sideways. Your preview is as wide as its panel, so make the panel narrow and look.

**Example**: on a computer, the three cards stand in a row as before. When the screen gets narrower, the last card goes on to a new row. On a phone, the cards stand one under the other.

- When the cards don't fit in one row, the next card goes on to a new row, with at least 16 pixels between the rows.
- On a phone, the cards stand one under the other, each still between 200 and 300 pixels wide, and nothing sticks out sideways.

Psst, `flex-wrap` goes on the list, like `display: flex` :)
