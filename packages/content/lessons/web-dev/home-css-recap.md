No new theory, just a challenge that uses what you've learned in CSS: classes, colors, backgrounds, contrast, fonts, text alignment and sizes in `rem`.

This time nobody tells you which property does what. Look at what the sign should look like, and pick the properties yourself.

If a style doesn't show, check three things: is the class the same in the HTML and the CSS? Does every declaration end with `;`? Is there a rule further down the file that says something else?

---

## Mission: The visiting hours sign

The visiting hours should look like the sign on a museum's door: a panel of their own, set apart from the rest of the page.

**Example**: under Visiting Hours, the three lines of hours stand on a panel of a different color from the page, in a typewriter-like font where every letter is the same width, centered.

- The paragraph with the hours has the class `hours`.
- It has a background the other paragraphs don't have.
- Its text is in a list of fonts that ends with `monospace`, and centered.
- Its text has a contrast of at least 4.5:1 with its background.

Psst, check your colors in a contrast checker :)
