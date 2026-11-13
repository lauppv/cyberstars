A music app can show your songs in any order you pick: the newest first, or your favorite first. The album itself doesn't change: its songs keep their own order. CSS can do the same with the items of a flex container.

## `order`

Each item of a flex container has an `order`, a number. Items with a lower number show first. Without it, every item has `0`, so they show in the HTML's order. A number below 0, like `-1`, shows before all of them:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .news p {
    background-color: #1e3a5f;
    padding: 8px;
    margin: 4px 0;
  }

  .breaking {
    color: #ffd166;
  }

  /* show */
  .news {
    display: flex;
    flex-direction: column;
  }

  .breaking {
    order: -1;
  }
  /* /show */
</style>
<div class="news">
  <p>Weather: sun all week</p>
  <p>Sport: the team won 3 : 1</p>
  <p class="breaking">Breaking: no school on Friday</p>
</div>
```

In the HTML, the breaking news comes last. On the screen, it comes first. The other two keep their order.

## The keyboard still follows the HTML

`order` changes only what the eye sees. A screen reader reads the page in the HTML's order. The Tab key goes from link to link in the HTML's order too:

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
  .menu {
    display: flex;
  }

  .home {
    order: 1;
  }
  /* /show */
</style>
<nav class="menu">
  <a href="#" class="home">Home</a>
  <a href="#">Games</a>
  <a href="#">Shop</a>
</nav>
```

On the screen, Home is the last link. Click in the cell, before the links, and press Tab a few times: the focus goes to Home first, at the far right, then jumps back to Games, at the left. Someone who uses the keyboard loses their way.

So use `order` only where the HTML's order still makes sense to someone who can't see the screen: the eye gets one order, the keyboard and the screen reader the other.

## Break it on purpose

Give `order` to the news box instead of the breaking news:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .news p {
    background-color: #1e3a5f;
    padding: 8px;
    margin: 4px 0;
  }

  .breaking {
    color: #ffd166;
  }

  /* show */
  .news {
    display: flex;
    flex-direction: column;
    order: -1;
  }
  /* /show */
</style>
<div class="news">
  <p>Weather: sun all week</p>
  <p>Sport: the team won 3 : 1</p>
  <p class="breaking">Breaking: no school on Friday</p>
</div>
```

Nothing moves. `order` places an item among the other items of its container, so it goes on the item that should move.

---

## Mission: Facts first

A reader in a hurry wants the numbers first. In your HTML, the article comes before the fact box, and that's right for a screen reader: the story first, then the extras. Leave the HTML as it is.

**Example**: on a computer, the fact box stands at the left of the article. On a phone, it sits above the article. In the HTML, the article still comes first.

- On every wiki page, the fact box shows before the article: at its left on a computer, above it on a phone.
- In the HTML, the article still comes before the fact box.

Psst, `order` changes what the eye sees, not the HTML :)
