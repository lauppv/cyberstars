No new theory, just a challenge that uses this part's first JavaScript: `querySelector`, `textContent`, template literals and a click.

This time nobody tells you which lines to write. Read what the crew needs, and put the pieces together yourself.

If nothing happens, open the console: a red line tells you where the script stopped. A `null` means a selector found nothing.

---

## Mission: Who's on duty?

The crew wants a button that says who's on duty today: the person on the first card.

**Example**: under the wake button, a button says `Who's on duty?`. Click it, and a paragraph under it says:

```text
Mara Vega is on duty today
```

- A button with the id `on-duty`, and under it an empty paragraph with the id `duty-today`.
- A click on the button writes, in `#duty-today`, the name from the first card's heading, followed by ` is on duty today`.
- The name is read from the card when the button is clicked: if the first card's name changes, so does the sentence.

Psst, a selector can pick the heading inside the first card, as in CSS :)
