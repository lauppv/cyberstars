Hang three pictures of different sizes in a row on a wall. You can line up their tops, their bottoms, or their middles. Each way looks tidy. A mix of them looks messy.

## `align-items`

`justify-content` places the items along the line. `align-items` places them across it: in a row, that's up and down. A scoreboard puts the names of the two schools in the middle of the big score's height:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .box {
    background-color: #1e3a5f;
    padding: 4px 12px;
    margin: 4px;
  }

  .score {
    font-size: 2.5rem;
  }

  /* show */
  .scores {
    display: flex;
    align-items: center;
  }
  /* /show */
</style>
<div class="scores">
  <p class="box">North School</p>
  <p class="box score">3 : 1</p>
  <p class="box">South School</p>
</div>
```

The two names sit at the middle of the score, on one line with it. Try the other values in place of `center`:

- `stretch`: each item as tall as the row. This is what you get when you don't write it.
- `flex-start`: at the top.
- `flex-end`: at the bottom.

With `stretch`, look at the names' boxes: they reach down as far as the score's box.

## Why boxes in a row have the same height

Without `align-items`, you get `stretch`. So boxes in a row are as tall as the tallest one, even when their text is short:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .note {
    background-color: #1e3a5f;
    padding: 0 12px;
    margin: 4px;
    width: 150px;
  }

  /* show */
  .notes {
    display: flex;
  }
  /* /show */
</style>
<div class="notes">
  <p class="note">Bring your gym shoes.</p>
  <p class="note">The trip to the museum leaves at 8:00 on Friday, from the school gate. Bring a lunch and a coat.</p>
</div>
```

The short note's box is as tall as the long one. For cards in a row, that's often what you want. Add `align-items: flex-start;` and each box is only as tall as its own text.

## Break it on purpose

Use `justify-content` when you want the middle of the height:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .box {
    background-color: #1e3a5f;
    padding: 4px 12px;
    margin: 4px;
  }

  .score {
    font-size: 2.5rem;
  }

  /* show */
  .scores {
    display: flex;
    justify-content: center;
  }
  /* /show */
</style>
<div class="scores">
  <p class="box">North School</p>
  <p class="box score">3 : 1</p>
  <p class="box">South School</p>
</div>
```

The three boxes move to the middle of the width, and the names stay at the top. In a row, `justify-content` is left and right, and `align-items` is up and down.

---

## Mission: One middle line

In your header, the station's name and the menu stand side by side. But the menu sits higher than the name: its links touch the top of the header.

**Example**: the name and the links read like one line of text, with the same room above and below the links.

- On every page, the menu's links sit in the middle of the header's height, on one line with the station's name.

Psst, in a row, up and down is the job of `align-items` :)
