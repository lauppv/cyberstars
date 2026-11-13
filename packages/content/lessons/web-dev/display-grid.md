Look at the home screen of a phone. The apps stand in rows and columns: four across, then the next four under them, each one right under the one above. Flex puts things in one line, and when they wrap, each line does its own thing. For rows **and** columns at once, CSS has a grid.

## `display: grid`

A **grid** is a box cut into columns and rows, like a sheet of squared paper. `display: grid` makes a box a grid, and its children are the grid's **items**. `grid-template-columns` says how many columns there are, and how wide each one is:

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

  /* show */
  .apps {
    display: grid;
    grid-template-columns: 100px 100px 100px;
  }
  /* /show */
</style>
<div class="apps">
  <p class="app">Camera</p>
  <p class="app">Music</p>
  <p class="app">Maps</p>
  <p class="app">Clock</p>
  <p class="app">Notes</p>
  <p class="app">Games</p>
</div>
```

What do you see? Three columns, each 100 pixels wide, because we wrote three widths. The grid puts the first three apps in the first row, and the next three in a second row, each one under the app above it. We never said how many rows: the grid makes as many as the items need.

Write a fourth width, `100px 100px 100px 100px`, and look: four apps a row now, and two in the second row.

## `gap` works here too

The apps touch each other. You know `gap` from flex: room between the items. A grid takes it too, between the columns **and** between the rows:

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

  /* show */
  .apps {
    display: grid;
    grid-template-columns: 100px 100px 100px;
    gap: 12px;
  }
  /* /show */
</style>
<div class="apps">
  <p class="app">Camera</p>
  <p class="app">Music</p>
  <p class="app">Maps</p>
  <p class="app">Clock</p>
  <p class="app">Notes</p>
  <p class="app">Games</p>
</div>
```

Now each app has 12 pixels of room on every side. To get different room between the rows and between the columns, there are `row-gap` and `column-gap`.

## Break it on purpose

Put the grid on the apps instead of their box:

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

  /* show */
  .app {
    display: grid;
    grid-template-columns: 100px 100px 100px;
    gap: 12px;
  }
  /* /show */
</style>
<div class="apps">
  <p class="app">Camera</p>
  <p class="app">Music</p>
  <p class="app">Maps</p>
  <p class="app">Clock</p>
  <p class="app">Notes</p>
  <p class="app">Games</p>
</div>
```

The apps stand one under the other, as plain paragraphs do. Each app is now a grid of its own, with three columns for its one word, and nothing arranges the apps themselves. As with flex, the grid goes on the box whose children you arrange.

One more thing to try: make the window of your preview narrow. Three columns of 100 pixels don't get narrower, so on a small screen they stick out. We'll fix that soon.

---

## Mission: The station in numbers

The crew wants the station's numbers at the top of the dashboard: how many people are on board, how much oxygen is left, and so on.

**Example**: under the dashboard's first line, six cards in two rows of three, with room between them:

```text
Crew on board    Oxygen     Water
6                98%        1,240 litres

Next launch      Power      Days in orbit
Friday           87%        412
```

- Under the dashboard's first paragraph, before the pad camera, a box with the class `stats` holds six cards. Each card has the class `stat`, a heading, and a number with the class `stat-value`. The headings and the numbers are yours.
- Each card has a background of its own, so it shows as a card.
- On a computer, the cards stand in three columns, with at least 16 pixels between the cards, across and down. More cards make more rows of three.

Psst, the grid goes on `.stats`, the box that holds the cards :)
