On a phone, an app's icon sometimes shows a small red circle with a number: 3 new messages. Whatever the icon looks like, the circle sits in its top right corner, always in the same spot.

## `position: absolute`

`position: absolute` takes an element out of its place. The others close the gap, as if it weren't there. Then `top`, `right`, `bottom` and `left` say where it goes inside a box: how far from each edge of that box.

```css preview
<style>
  .card {
    width: 220px;
    padding: 16px;
    background-color: lightyellow;
    border: 2px solid goldenrod;
  }
  .count {
    background-color: crimson;
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
  }
  /* show */
  .card {
    position: relative;
  }
  .count {
    position: absolute;
    top: 8px;
    right: 8px;
  }
  /* /show */
</style>
<div class="card">
  <h2>Chess Club</h2>
  <span class="count">3 new</span>
  <p>Games every Tuesday after school.</p>
</div>
```

"3 new" sits in the card's top right corner: 8 pixels from its top and 8 pixels from its right edge. The heading and the text close up, as if the mark weren't there.

## Which box?

`top: 8px` from what? From the closest box around the element that has a `position` of its own. That's the job of `position: relative` on the card. With no `top` and no `left`, the card doesn't move. But now it's the box that "3 new" measures from.

Press **View all the code** and change the card's width to 300px. The mark follows the corner: it measures from the card, whatever its size.

## Break it on purpose

Remove the card's `position: relative`:

```css preview
<style>
  .card {
    width: 220px;
    padding: 16px;
    background-color: lightyellow;
    border: 2px solid goldenrod;
  }
  .count {
    background-color: crimson;
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
  }
  /* show */
  .count {
    position: absolute;
    top: 8px;
    right: 8px;
  }
  /* /show */
</style>
<div class="card">
  <h2>Chess Club</h2>
  <span class="count">3 new</span>
  <p>Games every Tuesday after school.</p>
</div>
```

The mark leaves the card and flies to the top right corner of the whole page. No box around it has a `position`, so it measures from the page itself.

---

## Mission: In the corner

Your New badge sits next to the words of the Tools & Spare Parts heading. On an entry of the wiki's front page, a corner is a better place for it: it's always in the same spot, however long the heading is.

**Example**: on `wiki.html`, the New badge sits in the top right corner of the Tools & Spare Parts entry, inside it. On a phone, the entry is narrower, and the badge is still in its corner.

- The New badge sits inside the top right corner of its entry (its `article`): at most 24 pixels from its top edge and from its right edge, and not sticking out.
- It stays in the corner of its entry whatever the entry's size. The tests try entries with other texts, short and long, on a computer and on a phone.

Psst, the badge measures from its entry only if the entry has a `position` of its own :)
