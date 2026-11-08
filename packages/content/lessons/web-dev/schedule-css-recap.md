Combinators, attributes, states, places, marks, the cascade and backgrounds: your style sheet can now pick almost anything and say almost anything about it. One last styling mission before the schedule comes alive.

Worth keeping in mind:

- **A space means inside, `>` directly inside, `+` right after.**
- **`[attr^="..."]`** picks by what the HTML already says.
- **`:hover` after the stripes**, and never take away a focus ring without giving one back.
- **`::before` and `::after` need `content`**, and are for decoration.
- **Ids beat classes beat types**; a later rule wins a tie; inherited values lose to any rule on the element itself.

---

## Mission: Status Colors

- The delayed flight's row gets the class `delayed`. Its status cell: text in `#ffb3b3`.
- Every status cell of the flights table: `bold`.
- The cancelled flight's status starts with `✕ ` (the sign, then a space), added by CSS.
- The docking bays table looks like the flights table: the whole width, borders collapsed, its cells padded `8px 12px` with a `1px solid #2c4a7a` bottom border.
- The banner keeps `24px` of room under it.
