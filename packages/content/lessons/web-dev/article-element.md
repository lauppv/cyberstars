The front page of a school newspaper shows a few stories, each in its own box: a title, two lines and "read more on page 4". Each box makes sense alone. You could cut it out and pin it on a wall, and it would still say everything it needs to. HTML calls a piece like that an **article**.

## `<article>`

`<article>` holds a piece that stands on its own: a story, a post, a product in a shop, a card in a list.

```html preview
<h1>Our Shop</h1>
<article>
  <h2>Blue Sweater</h2>
  <p>Warm and soft, in every size.</p>
  <p><a href="sweater.html">See the sweater</a></p>
</article>
<article>
  <h2>Red Scarf</h2>
  <p>Long enough to go round your neck twice.</p>
  <p><a href="scarf.html">See the scarf</a></p>
</article>
```

Again, no new look. Each article holds its heading, its text and its link, and each makes sense without the other.

## Article or section?

Ask one question: would it make sense alone, somewhere else? A product card would: it's an article. "You need" from a recipe wouldn't: it's one part of the recipe, a section.

The whole recipe, on a page of its own, would make sense alone. So it's an article too, with its sections inside it:

```html
<main>
  <article>
    <h1>Pancakes</h1>
    <p>Easy pancakes for four people.</p>
    <section>...</section>
    <section>...</section>
  </article>
</main>
```

## Break it on purpose

Forget the closing tag `</article>` of the sweater:

```html preview
<h1>Our Shop</h1>
<article>
  <h2>Blue Sweater</h2>
  <p>Warm and soft, in every size.</p>
<article>
  <h2>Red Scarf</h2>
  <p>Long enough to go round your neck twice.</p>
</article>
```

It looks the same. Now right-click the scarf and pick **Inspect**: the scarf's article is **inside** the sweater's. Cut the sweater out of the page, and the scarf comes with it. Each piece needs its own closing tag.

---

## Mission: The wiki's front page

Your wiki has two pages, but no page lists them, and the menu doesn't lead there.

**Example**: a new page shows:

```text
Station Wiki
What the crew knows about life on board, written down for everyone.

The Greenhouse
Where our food grows, under blue and red lamps.
Read about the greenhouse

The Airlock
The small room between the station and space.
Read about the airlock
```

- A new page, `wiki.html`, is built like the others, from the header to the footer. Every page's menu has a fifth link, `Wiki`, to it.
- On it, an element with the class `wiki-list` holds one entry for each wiki page. Each entry is a piece that stands on its own: the topic as its heading, a sentence, and a link to its page.
- On the two wiki pages, the biggest heading and the sections stand together as one piece, inside `<main>`.

Psst, the commander's page is in a folder, so its menu needs `../wiki.html` :)
