Before you go shopping, you write a list: milk, bread, apples. Each thing on its own line, often with a dot in front. Nobody writes it as one long sentence. Web pages have lists too, made for exactly this.

## `<ul>` and `<li>`

A list is a `ul` element, short for **unordered list**. Each thing in it is an `li`, a **list item**:

```html preview
<ul>
  <li>Milk</li>
  <li>Bread</li>
  <li>Apples</li>
</ul>
```

The browser puts a bullet before each item and moves the list a little to the right. "Unordered" means the order doesn't matter: apples before bread is just as good.

## Why not paragraphs?

You could write three paragraphs, and it might even look similar. But a list **says** that these things belong together, and how many there are. A screen reader announces "list, 3 items" before reading them, so the listener knows what's coming. Paragraphs don't tell them that.

## Only items inside

A `ul` holds `li` elements and nothing else. Whatever you want in the list goes **inside** an `li`: text, a link, even a picture.

```html preview
<ul>
  <li><a href="chess.html">Chess</a></li>
  <li>Cards</li>
</ul>
```

## Break it on purpose

Forget the `<li>`s:

```html preview
<ul>
  Milk
  Bread
  Apples
</ul>
```

No bullets, all on one line. Without its items, a `ul` is just a box of loose words.

---

## Mission: The crew list

`crew.html` needs its most important part: who is on board.

**Example**: under the page's heading and paragraph, your page would show something like this:

```text
Crew

• Mara Vega
• Tomas Okafor
• Ines Lindqvist
• Kenji Arano
```

- A part with a heading one level under the page's heading, called Crew.
- Under it, a list with the id `crew`, with at least four crew members, one name per item. Later lessons use this id.

Psst, every name goes in its own `<li>` :)
