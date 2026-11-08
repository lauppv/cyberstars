Your page has one heading and one paragraph. A real page has more to say, so it splits it into **sections**, each with a heading of its own, like the chapters of a book.

## Six levels

HTML has six heading tags, from `h1` to `h6`. The number is the heading's **level**: `h1` is the title of the whole page, `h2` the title of a section, `h3` the title of a part inside that section, and so on.

Before writing them, sketch the page's outline, as you would the table of contents of a book. Here is the outline of a ship's manual:

```text
Ship's Manual
  Engines
    Starting the Engines
    Stopping the Engines
    When an Engine Fails
      Warning Lights
  Fuel
```

Each step to the right is one level down, and the HTML follows it heading for heading:

```html
<h1>Ship's Manual</h1>
<h2>Engines</h2>
<h3>Starting the Engines</h3>
<p>Turn the main key, then wait for the green light.</p>
<h3>Stopping the Engines</h3>
<h3>When an Engine Fails</h3>
<h4>Warning Lights</h4>
<h2>Fuel</h2>
```

**Fuel** is an `h2` again: it sits beside **Engines**, not inside it, so the outline steps back up. A section can have no parts at all, like **Fuel**, or several, like **Engines**. `h5` and `h6` go deeper still, but most pages never need them.

## Pick by meaning, not by size

The browser draws `h1` biggest and every level after it a bit smaller. It's tempting to pick a heading for its size, but that size is only the browser's default: later in the course you'll set it yourself with CSS. Pick the level by **where the heading sits** in the outline.

This matters to more people than you'd think. A **screen reader**, the program a blind visitor uses to hear a page read aloud, lists the headings so they can jump straight to a section. Search engines read them to learn what the page is about. Both trust the levels, so keep to three rules:

- **one `h1`** per page, the page's title;
- **no skipped levels**: under an `h2` comes an `h3`, never straight an `h4`;
- **headings are for titles only**. Text that should just look big isn't a heading.

---

## Mission: Station Map

A visitor who can't see the screen will hear your home page through a screen reader, jumping from heading to heading. Give it an outline they can find their way in. Keep your biggest heading and your paragraph, and under them add the station's sections, in this order:

- **About the Station**, nothing in it yet;
- **Today on Board**, which holds today's two shifts. Name the shifts yourself, like **Morning Shift** and **Night Shift**, and under each shift's title, a paragraph saying who works it.

Sketch the outline first, then pick each heading's level from where it sits in it. The preview should read like a table of contents.
