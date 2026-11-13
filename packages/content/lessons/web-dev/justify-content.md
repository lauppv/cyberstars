On a shelf with room to spare, you decide where the books go. You push them all to the left, put them in the middle, or spread them out with the same room between each one. The books stay the same: only the empty room around them moves.

## `justify-content`

In a flex container, `justify-content` says where the items sit along the line: from left to right, in a row. A music app puts its three buttons in the middle:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  /* show */
  .player {
    display: flex;
    justify-content: center;
  }
  /* /show */
</style>
<div class="player">
  <button>Back</button>
  <button>Play</button>
  <button>Next</button>
</div>
```

The buttons stand together in the middle of the line, with the same room on their left and on their right. Try the other values in place of `center`:

- `flex-start`: at the start of the line, on the left. This is what you get when you don't write it.
- `flex-end`: at the end of the line, on the right.
- `space-between`: the first at the start, the last at the end, and the same room between each one.
- `space-evenly`: the same room everywhere, at the ends too.

## No room left, no move

`justify-content` moves the items in the room left over. When the items fill the whole line, there is nothing to move:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .tip {
    background-color: #1e3a5f;
    padding: 0 12px;
    margin: 4px;
  }

  /* show */
  .tips {
    display: flex;
    justify-content: center;
  }
  /* /show */
</style>
<div class="tips">
  <p class="tip">Drink water before the game, and again at half time.</p>
  <p class="tip">Bring a second pair of socks, in case it rains.</p>
</div>
```

The two tips are long, so together they take the whole line, and `center` changes nothing. Now give each tip a width:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .tip {
    background-color: #1e3a5f;
    padding: 0 12px;
    margin: 4px;
  }

  /* show */
  .tips {
    display: flex;
    justify-content: center;
  }

  .tip {
    width: 120px;
  }
  /* /show */
</style>
<div class="tips">
  <p class="tip">Drink water before the game, and again at half time.</p>
  <p class="tip">Bring a second pair of socks, in case it rains.</p>
</div>
```

Now there is room left, and the two tips stand in the middle of the line.

## Break it on purpose

Give `justify-content` to the buttons instead of their parent:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  /* show */
  .player {
    display: flex;
  }

  button {
    justify-content: center;
  }
  /* /show */
</style>
<div class="player">
  <button>Back</button>
  <button>Play</button>
  <button>Next</button>
</div>
```

The buttons stay on the left. `justify-content` places the items of a flex container, so it goes on the container. `text-align: center` on the container doesn't help either: it centers the words inside each item, not the items.

---

## Mission: Cards in the middle

Your wiki cards fill the whole row of the list, so there is no room left to place them.

**Example**: on a computer, the three cards are narrower than now, and stand together in the middle of the list, with the same room on their left and on their right.

- Each card on `wiki.html` is between 200 and 300 pixels wide.
- The cards stand in the middle of the list, with as much room on their left as on their right.

Psst, `justify-content` goes on the cards' parent, not on the cards :)
