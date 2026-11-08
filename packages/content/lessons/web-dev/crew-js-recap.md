Your crew page's script reads numbers from the page, adds them up, loops over lists, uses functions and builds new elements, safely. One last mission puts it all to work.

Worth keeping in mind:

- **Text from the page is a string**: `Number()` before any maths.
- **Indexes start at 0**; the last one is `length - 1`.
- **`for...of`** for every value, **`for` with a counter** when you need the index.
- **A function that returns** works something out; a function that writes changes the page.
- **`querySelectorAll` is a snapshot**: read again after the page changes.
- **`textContent` for text, `createElement` for structure**; `innerHTML` only for your own markup.

---

## Mission: Roll Call

- On `crew.html`, after the cards' watch time, add a button with the id `roll-call-button` that says **Roll call**, an empty ordered list with the id `roll-call`, and an empty paragraph with the id `roll-summary`.
- A click on the button fills the list from the crew **cards**: one item per card, the card's name, then its job in parentheses, like `Mara Vega (Commander)`.
- Clicking again rebuilds the list from scratch: never two items for one card.
- The summary says how many answered, like `4 present`, worked out by a function that takes the number and returns that sentence.
