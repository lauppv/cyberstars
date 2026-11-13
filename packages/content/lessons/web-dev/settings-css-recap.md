No new theory, just a challenge that uses this part's CSS: custom properties and a theme, transitions, transforms, animations, dark mode and less motion, and text only for screen readers, with the grids and flex you already know.

The settings page works, but it looks unfinished: two headings with their buttons one under the other, on a big empty page.

---

## Mission: A settings page that looks finished

**Example**: on a computer, the Theme and the Motion settings are two cards side by side, each with its buttons in a row. On a phone, one card under the other. Point at a button: its border lights up in the accent color.

- The two settings are each a `section` with the class `setting`, both inside a box with the class `settings`.
- Each setting is a card: a background that stands out from the page (`--card-bg`), in both themes, and rounded corners.
- The cards stand side by side and fill the box when each one has room for at least 280 pixels. Narrower, one under the other, and nothing sticks out sideways.
- In each card, the buttons stand in a row with at least 8 pixels between them, going on to a new line when there's no room.
- Under the mouse, a button's border slowly turns the accent color. When the system asks for less motion, it changes at once.

Psst, a card that is a `section` keeps its heading, and the heading keeps the page's outline :)
