The web is a web because pages lead to one another. What leads from one to the next is a **link**.

## The anchor

A link is an `a` element, short for **anchor**. Its `href` attribute says where it leads, and the text between the tags is what the visitor clicks:

```html
<a href="https://en.wikipedia.org/wiki/Space_station">Read about space stations</a>
```

`https://en.wikipedia.org/wiki/Space_station` is a **full address**: it starts with `https://`, names the site, then the page on it. Use one whenever you link to another site. Links between the pages of your own site come in the next part.

A link is inline, like `<strong>`, so it sits inside a paragraph or a heading.

## Words that say where it leads

The words of a link should make sense on their own: **Read about space stations**, not **click here**. A screen reader can list every link of a page, out of their sentences, so the visitor picks one; ten links all called **click here** tell them nothing. Search engines read link text too.

## In a new tab

`target="_blank"` opens the link in a new tab, so your page stays open in its own. Add `rel="noopener"` with it:

```html
<a href="https://en.wikipedia.org/wiki/Space_station" target="_blank" rel="noopener">
  Read about space stations
</a>
```

Without `noopener`, a page opened in a new tab can reach back to the tab that opened it and send it to another address, such as a fake copy of your site asking for a password. New browsers do it for you, but older ones don't, and writing it says plainly what you meant.

## An email

An address that starts with `mailto:` opens the visitor's mail program with a new message to it:

```html
<a href="mailto:cargo@station.example">Write to the cargo bay</a>
```

## A jump inside the page

The `id` attribute gives an element a name of its own on the page: no two elements of a page share one, and it has no spaces. A link to `#` and that name jumps to the element:

```html
<a href="#loading">Loading times</a>
...
<h2 id="loading">Loading Times</h2>
```

You'll meet `id` again soon: CSS and JavaScript use it to find an element.

In the preview, links to other sites don't open: the console says where they would lead. Jumps inside the page work as in any browser.

---

## Mission: Station Links

- Give the heading **Today on Board** the id `today`.
- Right under your first paragraph, add a paragraph with a link that says **Jump to today** and jumps to that heading.
- In **About the Station**, add a link to a page about space of your choice, on another site, by its full address. It opens in a new tab, safely.
- At the end of the page, a link that says **Write to the crew** and opens an email to `crew@station.example`.
