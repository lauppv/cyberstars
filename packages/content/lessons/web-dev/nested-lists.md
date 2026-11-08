Some lists have lists inside them: a book's chapters and their parts, a shop's aisles and what's on them, a station's decks and their rooms.

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

The inner list belongs to **Cargo Bay**: it starts after the bay's name and ends before its `</li>`. The browser moves it a little to the right and gives it another kind of bullet. A screen reader says "list, 2 items" inside the first item, so the visitor hears what belongs to what.

The mistake to avoid is putting the inner list straight into the outer one, between two items:

```html
<ul>
  <li>Cargo Bay</li>
  <ul>
    <li>Crates</li>
  </ul>
</ul>
```

It looks almost the same, but a `ul` may only hold `li` elements, and now the crates don't belong to the bay any more.

Lists of either kind nest the same way: an `ol` of steps can hold a `ul` of details under one step.

Indent the inner list one step further than its item, so you can see at a glance what's inside what.

---

## Mission: Deck Plan

New crew members get lost on the station. On `crew.html`, after the morning routine, add a section called **Decks** with a plan of the station:

- at least three decks, named as you like, in a list in the class `decks`;
- for each deck, at least two of its rooms, listed so that each room clearly belongs to its deck.
