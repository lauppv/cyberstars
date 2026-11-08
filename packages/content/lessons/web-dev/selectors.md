A tag's name picks every element of that kind. Often you want fewer: only the warnings, only one heading. For that, CSS has two more kinds of selector.

## Classes

The `class` attribute puts an element in a group you name yourself. Any number of elements can share a class, and a dot in front of its name picks them all:

```html
<p class="fragile">Glass panels, handle with care.</p>
<p>Spare bolts.</p>
<p class="fragile">Seed samples, keep upright.</p>
```

```css
.fragile {
  color: darkorange;
}
```

Both fragile paragraphs turn orange; the bolts stay as they were. An element can be in several classes at once, their names separated by spaces: `class="fragile urgent"`.

Name a class after **what** the elements are, `fragile`, `warning`, `price`, not after how they look today: `orange-text` stops making sense the day you make them red.

## Ids

You know `id` from the jump links: a name only one element of the page has. A `#` in front of it picks that one element:

```css
#loading {
  color: darkgreen;
}
```

## Which to use

- A **type** selector, `h3`, for every element of a kind.
- A **class**, `.fragile`, for a group, even a group of one. This is the one you'll use most.
- An **id**, `#loading`, for the one element of the page with that name. It's handy for jump links and JavaScript, but a style for it can't be reused.

## Two rules, one element

What if two rules pick the same element? Your `h2` rule colors every section heading, and a rule for `#today` colors one of them. The browser takes the **more specific** one: an id names one element, so it beats a class, and a class beats a tag's name. The section heading with the id `today` takes the id's color, the others keep the `h2` one. Part 3 tells this story in full.

Several selectors can share one rule, separated by commas:

```css
h4,
h5 {
  color: gray;
}
```

---

## Mission: Spot the Warnings

- Put both the paragraph about Hatch 3 and the one about the visitors' badge in the class `warning`, and make the text of that class `firebrick`. The other paragraphs keep their color.
- Make the heading **Today on Board** `darkgreen`, by its id. The other section headings stay `steelblue`.
- With one rule, make the text below the line and the text above it `teal`.
