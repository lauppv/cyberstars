The web is called a web because pages lead to one another. What takes you from one page to the next is a **link**.

## The anchor

A link is an `a` element. The `a` is short for **anchor**. Its `href` attribute says where the link leads, and the text between the tags is what the visitor clicks:

```html
<a href="https://en.wikipedia.org/wiki/Mars">Read about Mars</a>
```

`https://en.wikipedia.org/wiki/Mars` is a **full address**: it starts with `https://`, then the name of the site, then the page on it. Use a full address whenever you link to another site. Links between the pages of your own site come in the next part.

A link is inline, like `<strong>`, so it goes inside a paragraph or a heading.

## Words that say where it leads

The words of a link should make sense on their own: **Read about Mars**, not **click here**. A screen reader can list all the links of a page without the sentences around them, so the visitor can pick one. Ten links all called **click here** tell them nothing. Search engines read link words too.

## In a new tab

`target="_blank"` opens the link in a new tab, so your page stays open in its own tab. Always add `rel="noopener"` next to it:

```html
<a href="https://en.wikipedia.org/wiki/Mars" target="_blank" rel="noopener">Read about Mars</a>
```

Without `noopener`, the page in the new tab can reach back to your tab and send it somewhere else, for example to a fake copy of your site that asks for a password. New browsers protect you anyway, but old ones don't, and writing it shows clearly what you meant.

## An email

An address that starts with `mailto:` opens the visitor's email app with a new message to that address:

```html
<a href="mailto:cargo@station.example">Write to the cargo bay</a>
```

## A jump inside the page

The `id` attribute gives an element its own name on the page. No two elements of a page can have the same id, and an id has no spaces. A link to `#` followed by that name jumps to the element:

```html
<a href="#loading">Loading times</a>
...
<h2 id="loading">Loading Times</h2>
```

You'll see `id` again soon: CSS and JavaScript use it to find an element.

In the preview, links to other sites don't open: the console tells you where they would go. Jumps inside the page work like in any browser.

---

## Mission: Station Links

Your page should take visitors where they want to go:

- Someone on a phone doesn't want to scroll past everything to see what's happening today. Right under your first paragraph, add a link that says **Jump to today** and takes them straight to **Today on Board**. Give that heading the id `today`: later lessons use it.
- In **About the Station**, link to a page about space of your choice on another site. A visitor who follows it shouldn't lose your page, and your page should stay safe.
- At the end of the page, a link that says **Write to the crew** and starts an email to `crew@station.example`.
