Three friends sit down on a long bench, and there is empty room left at its end. If they all move apart a little, the empty room is shared between them, and the bench is full. A flex container can share its room left the same way.

## `flex-grow`

`flex-grow` lets an item take a share of the room left in its line. A search bar gives all its room to the box you type in:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  /* show */
  .search {
    display: flex;
    gap: 8px;
  }

  .search input {
    flex-grow: 1;
  }
  /* /show */
</style>
<div class="search">
  <input placeholder="Search the shop" />
  <button>Search</button>
</div>
```

The button keeps its own width, and the box grows to fill the rest of the line. Without `flex-grow`, you get `0`: the item keeps its own size, and the room stays empty.

## Shares

The number is how many shares of the room left an item takes. On a plate, the vegetables get twice as much room as the rice:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .part {
    background-color: #1e3a5f;
    padding: 8px;
    margin: 0;
  }

  /* show */
  .parts {
    display: flex;
  }

  .one {
    flex-grow: 1;
  }

  .two {
    flex-grow: 2;
  }
  /* /show */
</style>
<div class="parts">
  <p class="part one">Rice</p>
  <p class="part two">Vegetables</p>
</div>
```

Of the room left over, the rice takes one share and the vegetables two. Give both `flex-grow: 1`, and they share it equally.

## Growing down a column

In a column, the line goes from top to bottom, so an item grows down. A chat app keeps the box to type in at the bottom of the screen, however few messages there are:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .screen {
    border: 2px solid #8ecbff;
    border-radius: 12px;
    height: 220px;
    width: 180px;
  }

  .screen p {
    background-color: #1e3a5f;
    padding: 8px;
    margin: 0;
  }

  /* show */
  .screen {
    display: flex;
    flex-direction: column;
  }

  .chat {
    flex-grow: 1;
  }
  /* /show */
</style>
<div class="screen">
  <p>Messages</p>
  <p class="chat">Lena: See you at six!</p>
  <p>Type a message</p>
</div>
```

The screen is 220 pixels tall, more than its three parts need. The chat takes all the height left, so the last part sits at the bottom. A column has room left only when it is taller than its items. Here, `height` makes it taller. A box in a flex row can be taller than its items too: with `stretch`, a short box gets as tall as the tallest box of its row.

## Break it on purpose

Give `flex-grow` to the search bar instead of the box:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  /* show */
  .search {
    display: flex;
    gap: 8px;
    flex-grow: 1;
  }
  /* /show */
</style>
<div class="search">
  <input placeholder="Search the shop" />
  <button>Search</button>
</div>
```

The box keeps its small width. `flex-grow` is for an item: it takes room from the line of its container. The search bar is the container, so its `flex-grow` does nothing here.

---

## Mission: Every link at the bottom

Your cards stand in the middle of the list, with empty room on both sides. And a card with a short text has its link higher than the others, so the links of a row don't line up.

**Example**: the cards fill the whole width of the list. In each card, the heading is at the top, the sentence under it, and the link at the bottom, so the links of a row stand on one line.

- The cards grow to share the whole width of the list: the first card of a row starts at its left edge, and the last one ends at its right edge.
- In every card, the heading stays at the top and the link sits at the bottom.

Psst, to grow down inside a card, the card must be a column :)
