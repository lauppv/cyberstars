Your page has one heading and one paragraph. A real page has more to say, so it splits it into **sections**, each with a heading of its own, like the chapters of a book.

## Six levels

HTML has six heading tags, from `h1` to `h6`. The number is the heading's **level**: `h1` is the title of the whole page, `h2` the title of a section, `h3` the title of a part inside that section, and so on.

```html
<h1>Cargo Bay</h1>
<h2>Crates</h2>
<h3>Heavy Crates</h3>
<p>Stacked at the bottom, never above the second row.</p>
<h3>Light Crates</h3>
<p>Stacked on top, strapped to the wall.</p>
<h2>Loading Times</h2>
```

Read it as an outline: the page **Cargo Bay** has two sections, **Crates** and **Loading Times**, and **Crates** splits into two parts. `h4`, `h5` and `h6` go deeper still, but most pages never need them.

## Pick by meaning, not by size

The browser draws `h1` biggest and every level after it a bit smaller. It's tempting to pick a heading for its size, but that size is only the browser's default: later in the course you'll set it yourself with CSS. Pick the level by **where the heading sits** in the outline.

This matters to more people than you'd think. A **screen reader**, the program a blind visitor uses to hear a page read aloud, lists the headings so they can jump straight to a section. Search engines read them to learn what the page is about. Both trust the levels, so keep to three rules:

- **one `h1`** per page, the page's title;
- **no skipped levels**: under an `h2` comes an `h3`, never straight an `h4`;
- **headings are for titles only**. Text that should just look big isn't a heading.

---

## Mission: Station Map

Give your home page an outline. Keep your heading and your paragraph, and under them add:

- a section heading **About the Station**;
- a section heading **Today on Board**;
- under **Today on Board**, a heading one level down for each of the two shifts working today. Name them yourself, like **Morning Shift** and **Night Shift**;
- under each shift's heading, a paragraph saying who works it.

Choose each level by where the heading sits, then look at the preview: it should read like a table of contents.
