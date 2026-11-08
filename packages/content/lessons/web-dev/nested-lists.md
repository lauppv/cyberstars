Some lists have lists inside them: a book's chapters and their sections, a shop's aisles and what's on them, a station's decks and their rooms.

## A list in an item

A list can sit **inside a list item**, after the item's own text:

```html
<ul>
  <li>
    Cargo Bay
    <ul>
      <li>Crates</li>
      <li>Fuel cells</li>
    </ul>
  </li>
  <li>Galley</li>
</ul>
```

The inner list belongs to **Cargo Bay**: it opens after its name and closes before its `</li>`. The browser indents it and gives it another kind of bullet. A screen reader says "list, 2 items" inside the first item, so the visitor hears what's in what.

The mistake to avoid is putting the inner list straight in the outer one, between two items:

```html
<ul>
  <li>Cargo Bay</li>
  <ul>
    <li>Crates</li>
  </ul>
</ul>
```

It looks almost the same, but a `ul` may only hold `li` elements, and the crates no longer belong to the bay.

Lists of either kind nest the same way: an `ol` of steps can hold a `ul` of details under one step.

Indent the inner list one level further than its item, so you can see at a glance what holds what.

---

## Mission: Deck Plan

On `crew.html`, after the morning routine:

- a section heading **Decks**;
- under it, an unordered list in the class `decks`, of at least three decks of the station, named as you like;
- inside each deck's item, after its name, a list of at least two of its rooms.
