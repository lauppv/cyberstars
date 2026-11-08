A tag's name picks every element of that kind. Often you want fewer: only the warnings, or only one heading. For that, CSS has two more kinds of selector.

## Classes

The `class` attribute puts an element in a group, and you choose the group's name. Many elements can share a class. A dot in front of the name picks them all:

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

Both fragile paragraphs turn orange, and the bolts stay as they were. An element can be in several classes at once, with spaces between the names: `class="fragile urgent"`.

Name a class after **what** the elements are (`fragile`, `warning`, `price`), not after how they look today. A class called `orange-text` stops making sense the day you make it red.

## Ids

You know `id` from the jump links: a name that only one element of the page has. A `#` in front of it picks that one element:

```css
#loading {
  color: darkgreen;
}
```

## Which to use

- A **type** selector, `h3`, for every element of a kind.
- A **class**, `.fragile`, for a group, even a group of one. This is the one you'll use most.
- An **id**, `#loading`, for the one element with that name. It's handy for jump links and JavaScript, but a style written for an id can't be used on anything else.

## Two rules, one element

What if two rules pick the same element? Say an `h2` rule colors every section heading, and a `#loading` rule colors one of them. The browser picks the **more specific** rule: an id names just one element, so it beats a class, and a class beats a tag's name. So the heading with the id `loading` gets the id's color, and the others keep the `h2` color. Part 3 explains this fully.

Several selectors can share one rule, with commas between them:

```css
h4,
h5 {
  color: gray;
}
```

---

## Mission: Spot the Warnings

Visitors skim your page. Make sure they notice what matters:

- The paragraph about Hatch 3 and the one about the visitors' badge are both warnings. Put them in the class `warning`: later lessons use it. Give the warnings a color that no other paragraph has, still easy to read on the white page.
- **Today on Board** changes every day, so it should stand out from the other section headings. Pick it by its id.
- The small numbers below and above the line, in H₂O and 10⁵, should stand out from the text around them too. One rule is enough for both.
