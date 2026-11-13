Books on a shelf stand side by side. Books in a pile on your desk lie one on top of the other. They are the same books, in another direction. A flex container can line up its items both ways too.

## `flex-direction`

`flex-direction` says which way the items of a flex container go:

- `row`: side by side, from left to right. This is what you get when you don't write it.
- `column`: one under the other, from top to bottom.

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .player {
    background-color: #1e3a5f;
    padding: 4px 12px;
    margin: 4px;
  }

  /* show */
  .team {
    display: flex;
    flex-direction: column;
  }
  /* /show */
</style>
<div class="team">
  <p class="player">Ida, goalkeeper</p>
  <p class="player">Noah, defender</p>
  <p class="player">Sofia, striker</p>
</div>
```

The three players stand one under the other. Change `column` to `row`, and they stand side by side again.

## Why a column?

Paragraphs stand one under the other anyway. So a column of paragraphs looks the same as no flex at all. A column matters for elements that would sit side by side on their own, like links. In a column, each one takes a line of its own:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  a {
    color: #5fd3c6;
    padding: 8px 12px;
  }

  /* show */
  .shop-menu {
    display: flex;
    flex-direction: column;
  }
  /* /show */
</style>
<nav class="shop-menu">
  <a href="#">Shoes</a>
  <a href="#">Bags</a>
  <a href="#">Hats</a>
</nav>
```

The shop's three links stand one under the other, like the menu of an app on a phone. Remove `flex-direction: column` and they sit side by side, on one line.

## Each container has its own direction

A row can hold boxes whose own parts stand one under the other. `flex-direction` changes only the container's own items:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .player {
    background-color: #1e3a5f;
    padding: 4px 12px;
    margin: 4px;
  }

  /* show */
  .team {
    display: flex;
    flex-direction: row;
  }
  /* /show */
</style>
<div class="team">
  <div class="player">
    <h3>Ida</h3>
    <p>Goalkeeper</p>
  </div>
  <div class="player">
    <h3>Noah</h3>
    <p>Defender</p>
  </div>
  <div class="player">
    <h3>Sofia</h3>
    <p>Striker</p>
  </div>
</div>
```

The players stand side by side: they are the items of `.team`. Inside each player, the name is above the position, as a heading and a paragraph always are, since `.player` is not a flex container.

## Break it on purpose

Make each player a flex container too:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .player {
    background-color: #1e3a5f;
    padding: 4px 12px;
    margin: 4px;
  }

  /* show */
  .team,
  .player {
    display: flex;
  }
  /* /show */
</style>
<div class="team">
  <div class="player">
    <h3>Ida</h3>
    <p>Goalkeeper</p>
  </div>
  <div class="player">
    <h3>Noah</h3>
    <p>Defender</p>
  </div>
  <div class="player">
    <h3>Sofia</h3>
    <p>Striker</p>
  </div>
</div>
```

Now inside each player, the name and the position stand side by side. A flex container is a row unless you say otherwise. A box whose parts must stay one under the other doesn't need to be a flex container. If it is one, give it `flex-direction: column`.

---

## Mission: Cards in a row

Your wiki page lists its entries in `.wiki-list`, one under the other, each across the whole page.

**Example**: the entries look like three cards on a table, side by side. Each card has a background of its own, and shows its heading, its sentence and its link one under the other.

- On `wiki.html`, the entries of `.wiki-list` stand side by side, in one row.
- Each entry has a background of its own, so you can see where its card ends.
- Inside each card, the heading, the sentence and the link stay one under the other.

Psst, a flex container is a row unless you say otherwise :)
