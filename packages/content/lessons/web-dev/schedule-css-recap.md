Combinators, attributes, states, places, marks, the cascade and backgrounds: your style sheet can now pick almost anything, and say almost anything about it. One last styling mission before the schedule comes alive, with no steps to follow.

When a rule doesn't seem to work, **Inspect** the element: the developer tools show every rule that tried to style it, with the ones that lost crossed out.

---

## Mission: Status Colors

Passengers read the board from far away. The status column should tell the story by itself.

- Put the delayed flight's row in the class `delayed`. Its status stands out from the other statuses, and stays easy to read.
- Every status is bold, and no other cell is.
- The cancelled flight's status starts with `✕ ` (the sign, then a space), added by CSS.
- The docking bays table should look like it belongs with the flights table: as wide as the column, single lines between its cells, room around the text of every cell and a line under it.
- The banner keeps some room under it, at least `12px`, before what comes next.
