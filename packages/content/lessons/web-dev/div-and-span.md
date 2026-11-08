Every element you've used so far means something: a heading, a paragraph, a list, a link. Sometimes you need a box that means nothing at all, just to group things so CSS or JavaScript can treat them as one.

## div and span

- **`div`** is a **block** box: it starts on a new line and takes the whole width, like a paragraph. It groups other elements.
- **`span`** is an **inline** box: it sits inside a line of text, like `<strong>`. It wraps a few words.

```html
<div class="crate">
  <h3>Crate 7</h3>
  <p>Contents: <span class="contents">seeds</span></p>
</div>
```

On their own they change nothing on screen. With a class, they give CSS and JavaScript a handle: style every `.crate` as a card, find every `.contents` to count what's in the bay.

## Boxes that mean something

Before reaching for a `div`, check whether HTML has an element that says what the box is. A few of them:

- `<header>`, the top of a page or a section, often with its title and navigation;
- `<main>`, the main content of the page, once per page;
- `<section>`, a part of the page with a heading of its own;
- `<article>`, something that would make sense alone, like a post or a profile card;
- `<footer>`, the end of a page or a section: contact, small print.

They behave like a `div` on screen, but a screen reader can jump between them, as it jumps between headings. Use `div` and `span` when nothing else fits: when the box is only there for its looks or its script.

---

## Mission: Crew Cards

On `crew.html`, after the decks:

- a box with the id `cards` that groups the crew's cards;
- inside it, a card for each of at least four crew members: a box in the class `card` holding a third-level heading with the member's name and a paragraph with their job;
- in that paragraph, the job itself is wrapped in a `span` in the class `role`, like `Job: <span class="role">Pilot</span>`.
