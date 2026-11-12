Pour too much juice in a glass and it spills over the top. Put too much text in a box with a set height, and it spills too: out of the box, over whatever comes next. The spill is called **overflow**, and CSS lets you decide what happens to it.

## `overflow`

```css preview
<style>
  .note {
    background-color: lightyellow;
  }

  /* show */
  .note {
    max-height: 100px;
    overflow: auto;
  }
  /* /show */
</style>
<p class="note">Rules of the pool: shower before you swim. No running on the tiles. No glass by the water. Children under eight swim with a grown-up. The deep end is for people who can swim a full length. Lifeguards have the last word. Lost and found is at the desk.</p>
```

The note is at most 100 pixels tall. If its text is longer, `overflow` decides what to do with the rest:

- `visible`: what every box does by default. The text spills out of the box;
- `hidden`: the rest is cut off. It's still in the HTML, but nobody can see it;
- `scroll`: a scroll bar inside the box, always there;
- `auto`: a scroll bar inside the box, but only when the text doesn't fit.

`auto` is the one you'll want most: the box stays its size, and visitors can still read everything by scrolling inside it.

## One direction

`overflow-y` is only for up and down, `overflow-x` only for left and right:

```css preview
<style>
  .note {
    background-color: lightyellow;
  }

  /* show */
  .note {
    max-height: 100px;
    overflow-y: auto;
  }
  /* /show */
</style>
<p class="note">Rules of the pool: shower before you swim. No running on the tiles. No glass by the water. Children under eight swim with a grown-up. The deep end is for people who can swim a full length. Lifeguards have the last word. Lost and found is at the desk.</p>
```

## Break it on purpose

Use `hidden` on a box of text:

```css preview
<style>
  .note {
    background-color: lightyellow;
  }

  /* show */
  .note {
    max-height: 100px;
    overflow: hidden;
  }
  /* /show */
</style>
<p class="note">Rules of the pool: shower before you swim. No running on the tiles. No glass by the water. Children under eight swim with a grown-up. The deep end is for people who can swim a full length. Lifeguards have the last word. Lost and found is at the desk.</p>
```

The end of the text is simply gone. Nobody knows there was more, and nobody can read it. `hidden` is for things you really want cut, like a picture's edges, never for text people need.

---

## Mission: Short bios

Every crew card on `crew.html` gets a short biography: a few sentences about each person. But some are long, and they'd make their cards much taller than the others.

**Example**: every card has a paragraph about its crew member. A long one stops at about three lines, and the rest scrolls inside it.

- Every card has a paragraph with the class `bio`, with a few sentences of your own.
- A bio is at most 100 pixels tall.
- A longer bio scrolls inside its box: nothing spills out, and nothing is cut off for good.

Psst, `auto` shows a scroll bar only when it's needed :)
