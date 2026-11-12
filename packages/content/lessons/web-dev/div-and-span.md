When you move house, you put things in boxes: one box for the kitchen, one for books. The box itself isn't a book or a plate. It's only there to keep things together, so you can carry them as one.

Every element you've used so far **means** something: a heading, a paragraph, a list. Sometimes you need a box that means nothing at all, only to hold other elements together. That's a `div`.

## `<div>`

```html preview
<div class="member">
  <h3>Sam Green</h3>
  <p>Plays chess on Sundays.</p>
</div>
```

The `div` holds a heading and a paragraph together, as one "member" box. On its own it changes nothing you can see: the heading and the paragraph look exactly as before. A `div` is a **block**, like a paragraph: it starts on a new line and takes the whole width.

What makes it useful is the class. With `class="member"`, CSS can later give every member box a background and a border, and they look like cards. JavaScript can find them all, count them, add new ones.

## Boxes inside a box

A `div` can hold other `div`s:

```html preview
<div id="members">
  <div class="member">
    <h3>Sam Green</h3>
    <p>Plays chess on Sundays.</p>
  </div>
  <div class="member">
    <h3>Lea Park</h3>
    <p>Runs the card games.</p>
  </div>
</div>
```

One big box, `members`, holds all the member boxes. Later, CSS can lay them out side by side, all at once, through the big box.

## Only when nothing else fits

Before you reach for a `div`, ask: is this a heading, a paragraph, a list? If HTML has an element that says what it is, use that. A `div` is for when you only need a box.

## Break it on purpose

Close a `div` too early:

```html preview
<div class="member">
  <h3>Sam Green</h3>
</div>
  <p>Plays chess on Sundays.</p>
```

The page looks the same now. But the paragraph has fallen out of its box. When CSS gives every member box a background, Sam's text will sit outside it. Indent what's inside a `div`, and you'll spot this at a glance.

---

## Mission: Crew cards

The crew directory gets a card for each crew member. Later lessons turn them into real cards with CSS, and fill them with JavaScript.

**Example**: after the decks, `crew.html` would show something like this (it doesn't look like cards yet):

```text
Mara Vega
Job: Commander

Tomas Okafor
Job: Engineer
...
```

- One `div` with the id `cards` holds all the cards.
- Inside it, at least four `div`s with the class `card`, one per crew member.
- Each card holds the crew member's name as a heading one level under the part headings, and a paragraph with their job, like Job: Pilot.

Psst, close each card's `div` after its paragraph, and the big box after the last card :)
