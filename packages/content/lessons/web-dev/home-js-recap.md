Your page has a script now that talks to the console, keeps values, builds strings, finds elements and answers a click. This mission needs all of it.

Things worth remembering:

- **`defer`**, so the script sees the whole page.
- **`const` by default, `let` for what changes.** A counter changes.
- **Template literals**, `` `Shift ${number}` ``, between backticks.
- **`querySelector` gives `null`** when nothing matches; "Cannot read properties of null" means a selector found nothing.
- **`addEventListener` sets things up once**; the code inside runs at every click.
- **The console is your friend**: log what you're unsure of, read the red lines.

---

## Mission: Shift Counter

The station runs in shifts, and the crew wants a counter on the home page.

- Under the wake-up button, add an empty paragraph with the id `shift` and a button with the id `next-shift` that says **Next shift**.
- When the page opens, the script writes `Shift 1` in the paragraph.
- Each click of the button moves to the next shift: `Shift 2`, `Shift 3`, and so on, and logs `Shift 2 begins`, `Shift 3 begins`...
