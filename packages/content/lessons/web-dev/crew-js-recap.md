Your crew page's script reads numbers from the page, adds them up, loops over lists, uses functions and builds new elements, safely. One last mission puts all of it to work, with no steps to follow.

Plan it before you write it: what happens when the page opens, what happens on a click, and what has to happen on a second click. When something goes wrong, log the values you're not sure about.

---

## Mission: Roll Call

Before every launch, the commander calls the roll.

- On `crew.html`, after the watch time, add a button with the id `roll-call-button` that says **Roll call**, an empty numbered list with the id `roll-call`, and an empty paragraph with the id `roll-summary`.
- A click on the button fills the list from the crew **cards**: one item per card, with the card's name and then its job in parentheses, like `Mara Vega (Commander)`.
- The commander may call the roll again and again: a second click starts the list over, so no card is ever listed twice.
- The summary says how many answered, like `4 present`.
