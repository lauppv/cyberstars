No new theory, just a challenge that uses this part's CSS: combinators, attribute selectors, pseudo-classes and pseudo-elements, with what you know about boxes and colors.

This time nobody tells you which selectors to use. Look at what the board should look like, and pick them yourself. If a rule seems to do nothing, Inspect the element: the styles show which rule won.

---

## Mission: Status signs

On a departures board, each status has a sign of its own, so travellers see it from far away.

**Example**: in the flight table, every status cell shows a small colored dot before its word, and each kind of status looks different: Boarding, On time, Delayed and Cancelled.

- Every status cell of the flight table's body has something added before its word with `::before`.
- The status cells of the four kinds of status look different from each other: a Boarding cell is unlike an On time cell, which is unlike a Delayed one, which is unlike a Cancelled one.
- Every status cell's text has a contrast of at least 4.5:1 with its background.

Psst, the rows already carry `delayed` and `cancelled`, and a cell has its own words to select by... or a class you add :)
