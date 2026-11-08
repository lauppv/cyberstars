A crew directory is a list of people. HTML has elements made for lists. Use them instead of a paragraph per line: they tell the browser and a screen reader "these belong together, and there are this many".

## Unordered lists

When the order doesn't matter, use an **unordered list**, `ul`, with each item in an `li`, a **list item**:

```html
<ul>
  <li>Water</li>
  <li>Seeds</li>
  <li>Spare bolts</li>
</ul>
```

The browser puts a bullet before each item. A screen reader says "list, 3 items" before reading them, so the visitor knows how much is coming.

## Ordered lists

When the order matters, like steps or a ranking, use an **ordered list**, `ol`:

```html
<ol>
  <li>Close the inner hatch</li>
  <li>Check the suit's pressure</li>
  <li>Open the outer hatch</li>
</ol>
```

The browser numbers the items by itself. Add an item in the middle, and the numbers after it change too. Never type the numbers into the items yourself.

## Only items inside

A `ul` or an `ol` holds `li` elements, and nothing else. Whatever you want in the list goes **inside** an `li`. And an `li` always sits in a list. A list item can hold more than text: a link, a picture, a paragraph.

---

## Mission: Roll Call

On `crew.html`, under your paragraph:

- a section called **Crew**, with the names of at least four crew members, as a list with the id `crew`, one name per item. The names can come in any order;
- a section called **Morning Routine**, with what the crew does every morning, at least three steps. Here the order matters: nobody eats breakfast before waking up.
