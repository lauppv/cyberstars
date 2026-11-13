A shop window shows its things in a long row along the street. In a narrow shop, the same things go on shelves, one above the other. It's the same shop with the same things, laid out for the room it has. A media query can give a page a whole other layout for a narrow window, not only one column less.

## Other areas on a narrow window

Inside a media query you can change anything about a grid: its columns, its areas, where an item goes. Here a page's areas are drawn once for a wide window and once for a narrow one:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .title,
  .menu,
  .text {
    background-color: #1e3a5f;
    padding: 8px;
    margin: 0;
  }

  .title {
    grid-area: top;
  }

  .menu {
    grid-area: side;
  }

  .text {
    grid-area: story;
  }

  /* show */
  .page {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-areas:
      "side top"
      "side story";
    gap: 12px;
  }

  @media (max-width: 500px) {
    .page {
      grid-template-columns: 1fr;
      grid-template-areas:
        "top"
        "story"
        "side";
    }
  }
  /* /show */
</style>
<div class="page">
  <h1 class="title">The Boat Cat</h1>
  <p class="menu">Chapters</p>
  <p class="text">Once upon a time, a cat lived on a boat.</p>
</div>
```

On a wide window, the chapters are a column on the left. On a narrow one, they go to the end, after the story, where they don't take the reader's room.

## An item's place on a narrow window

A media query can change one item too. An item over two columns is a problem when the grid has only one: the grid adds a second column for it, and the page sticks out. So on a narrow window, the item goes back to one cell:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .app {
    background-color: #1e3a5f;
    padding: 8px;
    margin: 0;
    text-align: center;
  }

  .apps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }

  /* show */
  .weather {
    grid-column: span 2;
  }

  @media (max-width: 340px) {
    .weather {
      grid-column: auto;
    }
  }
  /* /show */
</style>
<div class="apps">
  <p class="app weather">Weather: 18 °C</p>
  <p class="app">Camera</p>
  <p class="app">Music</p>
  <p class="app">Maps</p>
</div>
```

`auto` is what an item gets when you write nothing: one cell, wherever the grid puts it. `grid-row: auto` does the same for rows.

Why 340? Two columns of 150 pixels and the gap need 312 pixels, plus the page's own margins: about 330. Under that, the grid has one column, and that's where the weather must stop asking for two. 340 keeps a little room to spare.

## Break it on purpose

Remove the media query in the second example and make the panel very narrow. The grid has room for one column, but the weather asks for two, so the grid adds a second one. The row sticks out, and you can scroll the page sideways. When a page sticks out on a phone, look for an item that asks for more columns than there are.

---

## Mission: The dashboard on a phone

On a phone, your cards have room for only one column, but the Next launch card still asks for two, so the page sticks out sideways. The crew's card is very tall, and the week's seven days are squeezed into one row.

**Example**: on a phone, every card stands under the one before it, all as wide as the box of cards. The week takes two rows: Monday to Thursday, then Friday to Sunday.

- Whenever the cards stand in one column (in a window 560 pixels wide or narrower, for example), every card is as wide as the box of cards, one under the other. The crew's card takes one row, like the others.
- In the same windows, the week's days stand in two rows, four days in the first.
- Nothing sticks out sideways, on a phone 375 pixels wide too. In a window 600 pixels wide and on a computer, everything stays as before.

Psst, work out the width where the cards go to one column, as in the last lesson: two columns of 260 pixels, a gap of 16, and the page's padding :)
