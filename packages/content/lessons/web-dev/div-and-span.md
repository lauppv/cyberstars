Every element you've used so far means something: a heading, a paragraph, a list, a link. Sometimes you need a box that means nothing at all. It's only there to group things, so CSS or JavaScript can treat them as one.

## div and span

- **`div`** is a **block** box: it starts on a new line and takes the whole width, like a paragraph. It groups other elements.
- **`span`** is an **inline** box: it sits inside a line of text, like `<strong>`. It goes around a few words.

```html
<div class="notice">
  <p>The galley closes early tonight.</p>
  <p>Dinner is at 18:00.</p>
</div>
<p>Your locker code is <span class="code">4471</span>.</p>
```

The `div` groups two paragraphs into one notice. The `span` marks a few words inside a sentence, without breaking the line.

On their own, they change nothing on the screen. With a class, they give CSS and JavaScript something to hold on to: style every `.notice` as a yellow note, or find every `.code` to hide them.

## Boxes that mean something

Before you use a `div`, check whether HTML has an element that says what the box is. A few of them:

- `<header>`, the top of a page or a section, often with its title and navigation;
- `<main>`, the main content of the page, once per page;
- `<section>`, a part of the page with a heading of its own;
- `<article>`, something that would make sense alone, like a post or a profile card;
- `<footer>`, the end of a page or a section: contact, small print.

On the screen they act like a `div`, but a screen reader can jump between them, like it jumps between headings. Use `div` and `span` when nothing else fits: when the box is only there for its look or its script.

---

## Mission: Crew Cards

The crew directory gets a card for each crew member. Later lessons turn them into real cards with CSS and fill them with JavaScript, so they need these names. On `crew.html`, after the decks:

- one box with the id `cards` that holds all the cards;
- inside it, at least four cards, each a box in the class `card`. A card holds the crew member's name as a heading one level below the section headings, and a paragraph with their job, like **Job: Pilot**;
- in that paragraph, the job itself (**Pilot**, not **Job:**) is wrapped in the class `role`, without breaking its line.
