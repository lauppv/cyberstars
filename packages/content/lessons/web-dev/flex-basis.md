Before friends share what is left of a pizza, each one starts with a slice. First everyone gets the same start, then the rest is shared. In a flex container, each item can have a size to start from too.

## `flex-basis`

`flex-basis` is the size an item starts from along the line, before the room left is shared with `flex-grow`. In a row, it's a width to start from. A shop shows its products like this:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .product {
    background-color: #1e3a5f;
    padding: 8px;
    margin: 0;
  }

  /* show */
  .shop {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .product {
    flex-basis: 120px;
    flex-grow: 1;
  }
  /* /show */
</style>
<div class="shop">
  <p class="product">Red cap</p>
  <p class="product">Blue scarf</p>
  <p class="product">Green gloves</p>
  <p class="product">Warm socks</p>
  <p class="product">Rain coat</p>
</div>
```

Each product starts at 120 pixels, and as many as fit go on one line. Then they grow to share the room left, so every line is full. Make the panel of your preview narrower: fewer products fit on a line, and each one grows a little more.

## What an item starts from without it

Without `flex-basis`, an item starts from its `width`. With no width either, it starts from its content: all its text on one line. A long text on one line is very wide:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .story,
  .score {
    background-color: #1e3a5f;
    padding: 0 12px;
  }

  /* show */
  .news {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .story {
    flex-grow: 1;
  }
  /* /show */
</style>
<div class="news">
  <p class="story">Our team won the final on Saturday, after a hard game in the rain. The whole school came to watch, and the coach says it was the best season in ten years.</p>
  <p class="score">Final: 3 : 1</p>
</div>
```

The story starts as wide as its whole text on one line. That's wider than the line, so the score has no room left beside it and goes on to the next line. Now give the story a size to start from:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .story,
  .score {
    background-color: #1e3a5f;
    padding: 0 12px;
  }

  /* show */
  .news {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .story {
    flex-grow: 1;
    flex-basis: 200px;
  }
  /* /show */
</style>
<div class="news">
  <p class="story">Our team won the final on Saturday, after a hard game in the rain. The whole school came to watch, and the coach says it was the best season in ten years.</p>
  <p class="score">Final: 3 : 1</p>
</div>
```

The story starts at 200 pixels, so the score fits beside it, and the story grows to take the rest of the line. In a narrow panel, where 200 pixels and the score don't fit together, the score still goes under the story.

## Break it on purpose

Give each product a size to start from that's wider than the line:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .product {
    background-color: #1e3a5f;
    padding: 8px;
    margin: 0;
  }

  /* show */
  .shop {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .product {
    flex-basis: 2000px;
    flex-grow: 1;
  }
  /* /show */
</style>
<div class="shop">
  <p class="product">Red cap</p>
  <p class="product">Blue scarf</p>
  <p class="product">Green gloves</p>
  <p class="product">Warm socks</p>
  <p class="product">Rain coat</p>
</div>
```

Every product takes a line of its own: none of them fits beside another. A size to start from should be small enough for two items to fit on one line, where you want them side by side.

---

## Mission: The facts beside the article

On your wiki pages, the fact box sits under the long article, and readers scroll all the way down to find it.

**Example**: on a computer, the fact box stands beside the article, at its right. The article takes the rest of the row. On a phone, the fact box goes under the article, as now.

- The `<main>` of each wiki page (the greenhouse, the airlock, the tools) has the class `wiki-page`.
- On a computer, the fact box stands to the right of the article, between 200 and 300 pixels wide, and the article takes the rest of the row.
- On a phone, the fact box goes under the article, and nothing sticks out sideways.

Psst, without a size to start from, the article starts as wide as its longest paragraph on one line :)
