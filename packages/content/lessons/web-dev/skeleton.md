Before guests come for dinner, you set the table: a plate for each one, a glass, a fork. Nobody is eating yet, but you can already see how many are coming and where each one will sit. When the food arrives, nothing has to move. A page can set the table too, before its data comes.

## What a spinner doesn't say

A spinner says "wait". It doesn't say what's coming, or how much of it. And when the cards finally arrive, the page jumps: the text under the spinner is pushed down, often just when you were about to click it.

## Skeleton cards

A **skeleton** is a grey block where a card will come, as big as the card. It has no text: only its shape. When the real cards arrive, they take the place of the skeletons, and the page barely moves.

Skeletons are plain elements, styled with what you know: a height, a background, round corners.

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  /* show */
  .news {
    list-style: none;
    padding: 0;
  }

  .skeleton {
    height: 64px;
    margin-bottom: 12px;
    border-radius: 8px;
    background-color: #1e3a5f;
  }
  /* /show */
</style>
<h1>School news</h1>
<!-- show -->
<ul class="news">
  <li class="skeleton" aria-hidden="true"></li>
  <li class="skeleton" aria-hidden="true"></li>
  <li class="skeleton" aria-hidden="true"></li>
</ul>
<!-- /show -->
```

What do you see? Three dark blue blocks with round corners, one under the other. You can already guess that three news cards will come there.

The skeletons are list items, since the news will be list items in the same list. `list-style: none` and `padding: 0` take away the bullets and the room on the left that a list has. A skeleton is only for the eye, so `aria-hidden="true"` keeps a screen reader away from these empty items. The list's `aria-busy` already tells a screen reader to wait.

## Break it on purpose

Remove `height: 64px;`. The blocks disappear: an empty element is 0px tall, since nothing inside it takes room. A skeleton needs a height of its own.

Then write `Loading...` inside each skeleton. Now the page says "Loading..." three times, and a skeleton that talks is not a skeleton any more. The spinner's line already says it once.

---

## Mission: The table is set

The tracker shows a spinner, then an empty list. Grey blocks where the starship cards will come would show what's on the way.

**Example**: under the loading line, three grey blocks with round corners, one under the other, each as wide as the list and about as tall as a starship card. No bullets, and no text in them.

- In the list `ships`, at least three list items with the class `skeleton`, with no text, that only the eye meets.
- Each one is at least 60px tall and as wide as the list, with a background that stands out from the page's, in the light colors and in the dark ones.
- The list shows no bullets.

Psst, an empty element is 0px tall until you give it a height :)
