No new theory, just a challenge that uses this part's JavaScript: methods and `this`, `null`, `undefined`, `?.` and `??`, JSON, `localStorage`, Map and Set, the focus and live regions, and a script on every page that runs before the page shows.

The settings page has two Motion buttons, Full and Less, since the beginning of this part. They still do nothing. The site already knows how to stand still for a device that asks for less motion: now a visitor can ask for it too.

---

## Mission: Less motion, on request

**Example**: click Less: the page says `Motion: less`, the Less button is pressed, and the settings are saved. Open the dashboard: the LIVE label stands still, and the cards don't lift under the mouse. Click Full on the settings page, and everything moves again.

- A click on a motion button chooses its motion: the `settings` object keeps it and saves the settings, `#current-motion` and the text of the settings show it, and only that motion's button says it's pressed.
- With the motion `less`, `<html>` has the class `less-motion`, on the settings page at once, and on every page after it, before the page shows. With `full`, it doesn't.
- With the class `less-motion`, the site stands still as it does when the device asks for less motion: the LIVE label doesn't pulse, the cards have no transition and don't lift under the mouse, and the theme icons don't turn.
- Bringing settings, or forgetting them, sets the motion buttons and the class too.

Psst, the saved settings already hold the motion: `theme.js` can read it with the theme :)
