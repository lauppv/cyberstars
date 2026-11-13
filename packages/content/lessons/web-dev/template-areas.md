Before you move into a new room, you might draw it on paper: the bed here, the desk by the window, the wardrobe along the whole wall. A drawing like that is easy to read, much easier than numbers. CSS lets you draw a grid's layout in words.

## `grid-template-areas`

`grid-template-areas` is a drawing of the grid. Each text in quotes is one row, and each word in it is one cell, the name of what goes there. A name written in two cells side by side takes both:

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

  /* show */
  .page {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-areas:
      "top top"
      "side story";
    gap: 12px;
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
  /* /show */
</style>
<div class="page">
  <p class="text">Once upon a time, a cat lived on a boat.</p>
  <p class="menu">Chapters</p>
  <h1 class="title">The Boat Cat</h1>
</div>
```

The drawing has two rows. The first is `top top`: one area over both columns. The second is `side story`: two areas, one in each column.

## `grid-area`: who goes where

`grid-area` puts an item in the area with that name. The names are yours: `top`, `side`, `story` mean nothing to CSS, they only have to be the same in the drawing and in `grid-area`.

Look at the HTML: the title comes **last**, but it shows at the top. Like grid lines, areas don't care about the order in the HTML.

## An empty cell

A `.` in the drawing is a cell with nothing in it:

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

  /* show */
  .page {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-areas:
      ". top"
      "side story";
    gap: 12px;
  }
  /* /show */

  .title {
    grid-area: top;
  }

  .menu {
    grid-area: side;
  }

  .text {
    grid-area: story;
  }
</style>
<div class="page">
  <p class="text">Once upon a time, a cat lived on a boat.</p>
  <p class="menu">Chapters</p>
  <h1 class="title">The Boat Cat</h1>
</div>
```

The title now takes only the right column, over the story, and the top left cell stays empty.

## Break it on purpose

Draw an area that isn't a rectangle:

```css
grid-template-areas:
  "top side"
  "side story";
```

`side` is now in two cells that only touch at a corner. The browser can't use a drawing like that, so it ignores the whole `grid-template-areas`. Now the names lead nowhere: the items pile up in odd places, and some of them even disappear. An area must always be a rectangle. If your layout falls apart, look at your drawing first.

---

## Mission: The panels of the dashboard

Under the cards, the pad camera, the last launch and the countdown come one under the other, and the videos take a lot of room.

**Example**: under the cards, the pad camera and the last launch side by side, and the countdown under both of them, across the whole width:

```text
The launch pad, live    The last launch
[pad camera]            [launch video]
The countdown
[countdown]
```

- The pad camera, the last launch and the countdown are each in a part of their own, each with its heading, with the ids `pad-panel`, `launch-panel` and `countdown-panel`. A box with the class `panels` holds the three.
- The pad camera's panel is on the left and the last launch's on the right, side by side. The countdown's panel is under both, as wide as the two together. It stays like that even when the panels come in another order in the HTML.
- On a computer and in a window 800 pixels wide, no video sticks out of its panel.

Psst, a video is a box like a picture: `max-width` keeps it inside its panel :)
