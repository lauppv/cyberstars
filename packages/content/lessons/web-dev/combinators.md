You've already written `nav a`: two selectors with a space between them. That space is a **combinator**: it picks elements by where they sit compared to others. There are four.

## The four combinators

```css
table td { }   /* descendant: a td anywhere inside a table */
ul > li { }    /* child: an li directly inside a ul, not deeper */
h2 + p { }     /* next sibling: a p right after an h2, same parent */
h2 ~ p { }     /* later sibling: every p after an h2, same parent */
```

- **Descendant** (a space): inside, at any depth. You'll use this one the most.
- **Child** (`>`): only one level down. `.decks > li` picks the decks, not the rooms inside them.
- **Next sibling** (`+`): the element right after, with the same parent. `h1 + p` is the paragraph right under a page's title.
- **Later sibling** (`~`): any element that comes after, with the same parent.

You can chain them: `#flights tbody td` is every data cell in the body of the flights table.

## Why bother

Combinators let you style things by where they are, without putting a class on every element. Use classes for things that mean something, and combinators for things that follow from the shape of the page.

## Tables and borders

Table cells have their own borders, with a small gap between them. `border-collapse: collapse` on the table joins the borders next to each other into one line. Most data tables look like that.

---

## Mission: Styled Board

The departures board should look like the screens at a spaceport gate. Style it through the table, without adding a class to any cell:

- The flights table stretches across the whole column, with one single line between its cells, not double ones.
- Its header cells stand out from the data cells, and stay easy to read.
- Every cell of the flights table has room around its text, at least `4px` on each side, and a line under it, so each row is easy to follow. The bays table keeps its own look for now.
- On every page, the paragraph right after the page's title is an introduction: bigger than the paragraphs after it.
- The navigation's own links are bold. Links inside the text stay as they are.
