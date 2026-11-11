No new theory, just a challenge that uses what you've learned in this part's HTML: lists, numbered lists, lists inside lists, `div`, `span`, and jump links from the first part.

Read what the crew needs, then pick the elements yourself.

If something looks wrong, check that every inner list sits inside its `<li>`, and that every `div` closes where it should.

---

## Mission: Duty board

Every morning the crew checks who does what. `crew.html` gets a duty board.

**Example**: after the cards, the page would show something like this:

```text
Duty Board

1. Inspect the solar panels
    • Tomas Okafor
    • Ines Lindqvist
2. Harvest the greenhouse
3. Log the day's dockings
```

- A part with a heading at the same level as Crew, with the id `duty`.
- Right under its heading, the day's duties, at least three, in the order they're done.
- At least one duty lists, inside it, the crew members who work on it, at least two.
- Under the page's heading, a link jumps straight to the duty board.

Psst, a duty's crew list goes inside that duty's `<li>` :)
