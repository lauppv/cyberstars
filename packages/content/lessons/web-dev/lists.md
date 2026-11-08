A crew directory is a list of people. HTML has elements made for lists, and using them, rather than a paragraph per line, tells the browser and a screen reader "these belong together, and there are this many".

## Unordered lists

When the order doesn't matter, an **unordered list**, `ul`, with each item in a `li`, a **list item**:

```html
<ul>
  <li>Water</li>
  <li>Seeds</li>
  <li>Spare bolts</li>
</ul>
```

The browser puts a bullet before each item. A screen reader says "list, 3 items" before reading them, so the visitor knows how much is coming.

## Ordered lists

When the order matters, steps, a ranking, an **ordered list**, `ol`:

```html
<ol>
  <li>Close the inner hatch</li>
  <li>Check the suit's pressure</li>
  <li>Open the outer hatch</li>
</ol>
```

The browser numbers the items itself: add one in the middle and the numbers after it follow. Never type the numbers into the items.

## Only items inside

A `ul` or an `ol` holds `li` elements and nothing else directly; whatever you want in the list goes **inside** an `li`. And an `li` always sits in a list. A list item can hold more than text: a link, a picture, a paragraph.

---

## Mission: Roll Call

On `crew.html`, under your paragraph:

- a section heading **Crew**, and under it a list with the id `crew`, of at least four crew members, one name per item. Order doesn't matter;
- a section heading **Morning Routine**, and under it the crew's morning routine as at least three steps, in order.
