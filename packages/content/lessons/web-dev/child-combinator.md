"Children of the Smith family" and "everyone descended from the Smiths" aren't the same: the second includes grandchildren and great-grandchildren. CSS can make that difference too.

## `>`: children only

A `>` between two selectors picks elements that are **direct children** of the first, one level down, no deeper:

```css
.menu > li {
  margin-bottom: 16px;
}
```

```html
<ul class="menu">
  <li>
    Drinks
    <ul>
      <li>Tea</li>
      <li>Juice</li>
    </ul>
  </li>
  <li>Snacks</li>
</ul>
```

Drinks and Snacks are children of `.menu`: they get the margin. Tea and Juice are inside Drinks's list, so they're **grandchildren**: they don't.

With a space instead, `.menu li` would pick all four, and the drinks would be spread out too.

## Space or `>`?

- A space: anywhere inside. Usually what you want.
- `>`: only one level down. For nested things, like lists in lists, when the outer and inner levels should look different.

## Break it on purpose

Use a space on the nested menu:

```css
.menu li {
  margin-bottom: 16px;
}
```

Tea and Juice get the big margin too, and the inner list falls apart. When styles leak into a nested list, try `>`.

---

## Mission: Spread out the decks

On `crew.html`, the deck plan is hard to read: the decks and their rooms are all squeezed together.

**Example**: the three decks stand apart from each other, with room under each one, while the rooms inside each deck stay close together.

- Every deck in `.decks` has at least 8 pixels of margin under it.
- The rooms inside the decks have no margin under them.

Psst, `>` picks the decks without their rooms :)
