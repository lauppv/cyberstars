In a class photo, everyone stands in a row. One kid sits on a chair in front, lower than the others. One person in the row does it their own way, and everyone else stays as they are.

## One item, its own way

A school blog shows each post with a picture, a sentence and a small **New** label. Without `align-items`, every item stretches to the height of the row, and the label does too:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .photo {
    background-color: #8ecbff;
    width: 100px;
    height: 100px;
  }

  .text {
    margin: 0;
  }

  .new {
    background-color: #ffd166;
    color: #0b1d3a;
    padding: 4px 8px;
    border-radius: 6px;
  }

  /* show */
  .post {
    display: flex;
    gap: 12px;
  }
  /* /show */
</style>
<div class="post">
  <div class="photo"></div>
  <p class="text">Our class trip to the lake: three days of boats, rain and songs.</p>
  <span class="new">New</span>
</div>
```

The label turns into a tall yellow bar, as tall as the picture. The sentence stretches too, but you can't see it, since it has no background.

## `align-self`

`align-items` on the container places all its items across the line. `align-self` on one item places that item only, and wins over `align-items` for it. It takes the same values: `stretch`, `flex-start`, `center` and `flex-end`.

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .photo {
    background-color: #8ecbff;
    width: 100px;
    height: 100px;
  }

  .text {
    margin: 0;
  }

  .new {
    background-color: #ffd166;
    color: #0b1d3a;
    padding: 4px 8px;
    border-radius: 6px;
  }

  /* show */
  .post {
    display: flex;
    gap: 12px;
  }

  .new {
    align-self: flex-start;
  }
  /* /show */
</style>
<div class="post">
  <div class="photo"></div>
  <p class="text">Our class trip to the lake: three days of boats, rain and songs.</p>
  <span class="new">New</span>
</div>
```

The label sits at the top, only as tall as its word. The picture and the sentence stay as they were. Try `center` and `flex-end` for the label too.

## Break it on purpose

Give `align-self` to the post instead of the label:

```css preview
<style>
  body {
    background-color: #0b1d3a;
    color: #f0f4ff;
    font-family: Verdana, sans-serif;
  }

  .photo {
    background-color: #8ecbff;
    width: 100px;
    height: 100px;
  }

  .text {
    margin: 0;
  }

  .new {
    background-color: #ffd166;
    color: #0b1d3a;
    padding: 4px 8px;
    border-radius: 6px;
  }

  /* show */
  .post {
    display: flex;
    gap: 12px;
    align-self: flex-start;
  }
  /* /show */
</style>
<div class="post">
  <div class="photo"></div>
  <p class="text">Our class trip to the lake: three days of boats, rain and songs.</p>
  <span class="new">New</span>
</div>
```

The label is a tall bar again. `align-self` places an item in its container's line, so it goes on the item. The post is the container: nothing around it is a flex container, so its `align-self` does nothing.

---

## Mission: Only as tall as its facts

Your fact box stands beside the article. Give it a background, and you see a problem: it stretches down as far as the article goes, with empty room under its facts.

**Example**: on a computer, the fact box is a box with a background of its own, at the top of the row, and it ends right after its last fact. The article beside it stays as it is.

- The fact box has a background of its own.
- On a computer, the fact box sits at the top of the row, and it is only as tall as its facts.

Psst, `align-self` goes on the one item that sits its own way :)
