You've written `nav a` already: two selectors with a space between. That space is a **combinator**: it picks elements by where they sit relative to others. There are four.

## The four combinators

```css
table td { }   /* descendant: a td anywhere inside a table */
ul > li { }    /* child: an li directly inside a ul, not deeper */
h2 + p { }     /* next sibling: a p right after an h2, same parent */
h2 ~ p { }     /* later sibling: every p after an h2, same parent */
```

- **Descendant** (a space): inside, at any depth. The one you'll use most.
- **Child** (`>`): one level down only. `.decks > li` picks the decks, not the rooms inside them.
- **Next sibling** (`+`): the element right after, with the same parent. `h1 + p` is the paragraph right under a page's title.
- **Later sibling** (`~`): any element after, with the same parent.

They chain: `#flights tbody td` is every data cell in the body of the flights table.

## Why bother

Combinators let you style by structure without a class on every element. The first paragraph after the title can be an intro, bigger than the rest, on every page at once, with `h1 + p`. Classes still win for anything that means something; combinators are for what follows from the page's shape.

## Tables and borders

Table cells have their own borders, a small gap between each. `border-collapse: collapse` on the table merges neighbouring borders into one line, the look of most data tables.

---

## Mission: Styled Board

- The flights table spans the whole column, its borders collapsed.
- Its header cells: a background of `#13294f`.
- Every cell of the flights table: `8px 12px` of padding and a bottom border of `1px solid #2c4a7a`, picked through the table, with no class on the cells.
- On every page, the paragraph right after the biggest heading is an intro: `1.25rem`.
- Only the navigation's own links, its direct children, are `bold`.
