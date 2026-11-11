Move your mouse over a button on almost any website: it changes colour a little, as if to say "yes, you can click me". The button hasn't changed: it's in a different **state**, with the mouse on it. CSS can style an element just for that state.

## `:hover`

A **pseudo-class** is a word after a `:` that picks an element only while it's in some state:

```css
a:hover {
  color: gold;
}
```

"A link, while the mouse is over it". Move the mouse onto a link: it turns gold. Move it away: it goes back.

It works on any element:

```css
#scores tbody tr:hover {
  background-color: #1e3a5f;
}
```

Every row of a table lights up while the mouse is on it, so your eye can follow it across, even in a wide table.

## Phones

A phone has no mouse, so nothing hovers. Some phones treat a tap as a quick hover, others don't. So `:hover` is for extra help, never for something people need: never hide important information until a hover.

## Break it on purpose

Put a space before the colon:

```css
#scores tbody tr :hover {
  background-color: #1e3a5f;
}
```

Now it means "any element **inside** a row, while hovered": the cells light up one at a time, not the whole row. The `:` sticks to the element it's about, with no space.

---

## Mission: Follow the row

The flight table is wide, and it's easy to lose your place in a row.

**Example**: move the mouse over a flight, and its whole row lights up in a color of your own. Move away, and it goes back.

- A row of the flight table's body, while the mouse is over it, has a background it doesn't have otherwise.
- Without the mouse on it, it doesn't.

Psst, no space before the `:` :)
