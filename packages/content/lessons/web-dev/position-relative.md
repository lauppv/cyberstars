In a class photo, everyone stands in a row. Noah wants to be seen, so he takes a small step forward. Nobody else moves. His place in the row stays empty, and it's still his. Only Noah changed where he stands.

CSS can do the same: move one element a little from its place, and leave everything else where it was.

## `position: relative`

The browser puts each element after the one before it: words one after another on a line, boxes one under the other. That's the element's own place.

`position: relative` lets an element leave its own place by a few pixels. `top`, `left`, `bottom` and `right` say how far:

```css preview
<style>
  .sale {
    background-color: crimson;
    color: white;
    padding: 2px 6px;
    font-size: 0.75rem;
  }
  /* show */
  .sale {
    position: relative;
    top: -6px;
  }
  /* /show */
</style>
<p>Blue sweater: 25 euros <span class="sale">Sale</span></p>
<p>Red scarf: 12 euros</p>
```

The Sale mark sits 6 pixels higher than the words next to it. The price and the scarf under it stay where they were. Try `-12px` in the cell: only the mark moves, higher.

## Which way it goes

`top: 6px` means "6 pixels away from the top of its own place", so the element goes **down**. To go up, the number gets a minus: `top: -6px`. In the same way, `left: 20px` pushes it away from the left, so it goes **right**.

```css preview
<style>
  .player {
    display: inline-block;
    width: 70px;
    padding: 8px;
    background-color: steelblue;
    color: white;
    text-align: center;
  }
  /* show */
  .captain {
    position: relative;
    top: 20px;
    left: 20px;
  }
  /* /show */
</style>
<p>
  <span class="player">Ida</span>
  <span class="player captain">Noah</span>
  <span class="player">Sofia</span>
</p>
<p>Next game: Saturday at 10:00.</p>
```

Noah's box moves 20 pixels down and 20 pixels to the right. Now it covers a part of Sofia's box and of the line under it. Look at the gap between Ida and Noah: that's still Noah's place. Nobody made room for him, and nobody took his place.

## A margin moves the others

Compare it with a margin, which you already know:

```css preview
<style>
  .player {
    display: inline-block;
    width: 70px;
    padding: 8px;
    background-color: steelblue;
    color: white;
    text-align: center;
  }
  /* show */
  .captain {
    margin-top: 20px;
    margin-left: 20px;
  }
  /* /show */
</style>
<p>
  <span class="player">Ida</span>
  <span class="player captain">Noah</span>
  <span class="player">Sofia</span>
</p>
<p>Next game: Saturday at 10:00.</p>
```

A margin adds room around Noah's box, so everything around it moves: the whole row goes down, Sofia goes to the right, and the line under them goes down too. With `position: relative`, only Noah moves. That's the point of it: a small move that changes nothing else.

## Break it on purpose

Remove `top` and keep only `position: relative`:

```css preview
<style>
  .sale {
    background-color: crimson;
    color: white;
    padding: 2px 6px;
    font-size: 0.75rem;
  }
  /* show */
  .sale {
    position: relative;
  }
  /* /show */
</style>
<p>Blue sweater: 25 euros <span class="sale">Sale</span></p>
<p>Red scarf: 12 euros</p>
```

The Sale mark doesn't move. `position: relative` only allows the move; `top`, `left`, `bottom` or `right` make it. Now add `top: 6px`, without the minus: the mark goes down, lower than the words.

---

## Mission: Something new

Your wiki's front page, `wiki.html`, lists three entries. The newest one is Tools & Spare Parts, and readers should see at once that it's new.

**Example**: the heading of the Tools & Spare Parts entry ends with a small badge that says `New`, in colors of your own. It sits a little higher than the words of the heading, like a sticker.

- The heading of the Tools & Spare Parts entry ends with a `span` with the class `badge` that says `New`. Its words read well on its background: a contrast of at least 4.5:1.
- The badge is lifted a little from its own place, so it sits higher than the words next to it. Nothing else on the page moves.
- The tests also put the badge in another heading: it lifts the same way there, so style it by its class.

Psst, `top` pushes away from the top, so it goes down. To lift, the number needs a minus :)
