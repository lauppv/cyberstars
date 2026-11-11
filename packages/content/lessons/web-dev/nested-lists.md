Think of a school's floors: the ground floor has the gym and the canteen, the first floor has the labs and the library. That's a list of floors, and each floor has its own little list of rooms. A list inside a list.

## A list inside an item

A list can sit **inside a list item**, after the item's own text:

```html
<ul>
  <li>
    Ground floor
    <ul>
      <li>Gym</li>
      <li>Canteen</li>
    </ul>
  </li>
  <li>
    First floor
    <ul>
      <li>Labs</li>
      <li>Library</li>
    </ul>
  </li>
</ul>
```

```text
• Ground floor
    ◦ Gym
    ◦ Canteen
• First floor
    ◦ Labs
    ◦ Library
```

The inner list belongs to its floor: it starts after the floor's name and ends before that floor's `</li>`. The browser pushes it further right and gives it another kind of bullet.

Indent the inner list one step further than its item in your file, so you can see at a glance what's inside what.

## Break it on purpose

Put the inner list straight into the outer one, between two items:

```html
<ul>
  <li>Ground floor</li>
  <ul>
    <li>Gym</li>
  </ul>
  <li>First floor</li>
</ul>
```

It looks almost the same. But a `ul` may only hold `li`s, and now the gym doesn't belong to the ground floor any more: it floats between two floors. A screen reader can't tell what goes with what. The inner list always goes **inside** an `<li>`, before its `</li>`.

---

## Mission: Deck plan

New crew members get lost on the station. Show them where everything is.

**Example**: after the morning routine, `crew.html` would show something like this:

```text
Decks

• Upper Deck
    ◦ Bridge
    ◦ Observatory
• Living Deck
    ◦ Galley
    ◦ Gym
• Lower Deck
    ◦ Cargo bay
    ◦ Greenhouse
```

- A part with a heading at the same level as Crew, called Decks.
- Under it, a list with the class `decks`, with at least three decks.
- Each deck has at least two rooms, in a list inside that deck's item.

Psst, the inner list goes inside the `<li>`, before its `</li>` :)
