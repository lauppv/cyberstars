In a kitchen drawer, the knives, forks and spoons each have a box of their own, all in a neat grid. On the counter, the jars just stand in a line, each one as wide as it is, and the line goes on as long as there's room. Both ways are tidy, but for different things. Flex and grid are the same.

## Flex: a line of things, each its own size

Labels on a photo, in a line:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .tag {
    background-color: #1e3a5f;
    padding: 4px 12px;
    margin: 0;
    border-radius: 16px;
  }

  /* show */
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  /* /show */
</style>
<div class="tags">
  <p class="tag">beach</p>
  <p class="tag">summer holiday</p>
  <p class="tag">dog</p>
  <p class="tag">best friends forever</p>
  <p class="tag">ice cream</p>
</div>
```

Each label is as wide as its words. A short one is small, a long one is wide, and when the line is full, the next label goes on to a new line. Flex thinks in **one line**: it puts the items one after the other, and each one takes its own room.

## Grid: rows and columns

The same labels in a grid:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .tag {
    background-color: #1e3a5f;
    padding: 4px 12px;
    margin: 0;
    border-radius: 16px;
  }

  /* show */
  .tags {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  /* /show */
</style>
<div class="tags">
  <p class="tag">beach</p>
  <p class="tag">summer holiday</p>
  <p class="tag">dog</p>
  <p class="tag">best friends forever</p>
  <p class="tag">ice cream</p>
</div>
```

Now every label is as wide as its column, whatever its words: "dog" gets as much room as "summer holiday", and the long one breaks onto two lines. The labels line up under each other. Grid thinks in **rows and columns at once**: first the cells, then the items in them.

## How to pick

Ask yourself: should things line up in columns, one under the other?

- No, they just follow each other, each as big as it is: a menu, labels, buttons in a row. That's flex.
- Yes, they form a table of boxes: cards, a calendar, the parts of a page. That's grid.

A page often uses both: a grid for its big parts, and flex inside one of them.

## Break it on purpose

Make the menu of a page a grid with `repeat(5, 1fr)`, and give it a short link like "FAQ" and a long one like "Opening hours". Every link gets the same room, so "FAQ" floats in a wide box while "Opening hours" breaks onto two lines. Nothing in a menu needs to line up in columns: flex would give each link the room it needs.

---

## Mission: Who is on duty

The crew wants to see at a glance who is on duty today, next to the countdown.

**Example**: beside the countdown, a panel with a heading such as "On duty today" and the names of the crew on duty, each in a small rounded box as wide as the name:

```text
The countdown           On duty today
[countdown]             (Vega) (Orion) (Lyra) (Altair)
                        (Nova) (Rigel)
```

- A new panel with the id `duty-panel`, with a heading and a list with the id `on-duty`: one list item per name, at least four. The names are yours.
- The duty panel stands beside the countdown's panel, at the right, under the last launch.
- The names stand side by side, without bullets, each in a box with a background of its own, only as wide as the name. When there's no room, the next name goes on to a new line.

Psst, the panels are a grid, and the names inside one panel are a line :)
