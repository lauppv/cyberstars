Look at your phone's list of messages. A long message doesn't fill three lines: you see the start, then "...", and you tap to read the rest. That "..." is called an **ellipsis**, and CSS can draw it.

## Three lines together

```css preview
<style>
  .card {
    width: 200px;
    padding: 8px;
    background-color: lightyellow;
  }

  /* show */
  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* /show */
</style>
<div class="card">
  <p class="title">A Very Long Title That Doesn't Fit</p>
  <p>By Sam Green</p>
</div>
```

Each line does one job:

- `white-space: nowrap`: never wrap onto a second line. The text stays on one line, however long;
- `overflow: hidden`: cut off what doesn't fit the box's width;
- `text-overflow: ellipsis`: where it's cut, show `...`.

All three are needed. Without `nowrap`, the text wraps and nothing is cut. Without `hidden`, the line just runs out of the box. Without `ellipsis`, the cut is a hard edge in the middle of a letter.

The box needs a width it can't grow past, like your cards have, so there's an edge to cut at.

## When to use it

Use it for short labels in a tight space: a name on a card, a file name, a menu entry. Not for real text: a paragraph cut after one line is a paragraph nobody can read. The full text is still in the HTML, so a screen reader reads all of it.

## Break it on purpose

Leave out `white-space: nowrap`. A long name simply wraps onto a second line, and no `...` ever shows, because nothing overflows the box. Then put `nowrap` back and leave out `overflow: hidden`: now the name runs straight out of the card, over the next one.

---

## Mission: Long names

On `crew.html`, a crew member with a long name, like "Maximiliana Ostrowski-Lindqvist", would push their card's name onto two or three lines.

**Example**: a long name stays on one line, and ends in `...` where it reaches the card's edge. The card stays the same size.

- A name on a card always stays on one line.
- A name too long for the card is cut at the card's edge, with `...`.

Psst, it takes three lines of CSS together :)
