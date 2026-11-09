No new theory, just a challenge that uses this part's CSS: the box's layers (padding, border, margin), `display`, and round corners, with colors and contrast from the first part.

This time nobody tells you which properties to use. Look at what the badge should look like, and pick them yourself.

If something looks wrong, Inspect it: the box diagram shows each layer, and the styles show which rule won.

---

## Mission: Job badges

On every card, the job should look like a badge: a small, rounded label of its own color, like the ones on a uniform.

**Example**: under each crew member's name, after "Job:", the job (Pilot, Engineer...) sits on a small rounded label of its own color, with a little room around its word, still on the same line.

- Every job has a background the card doesn't have.
- Every job has at least 4 pixels of room inside, on its left and right.
- Its corners are rounded by at least 4 pixels.
- It stays on its line, and its text has a contrast of at least 4.5:1 with its background.

Psst, a job is a `span`, so think about what kind of box it is :)
