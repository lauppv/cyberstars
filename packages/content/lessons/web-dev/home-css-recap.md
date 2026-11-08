Your home page has a style sheet of its own now: colors that hold up at night, a font, sizes that follow the visitor. Time to use all of it at once.

A few things to keep in mind:

- **A rule is a selector and declarations**: `selector { property: value; }`. A missing `;` or `}` breaks the declarations after it, so when a style doesn't show, look just before it.
- **Type, class or id**: every `p`, every `.warning`, the one `#today`. A class is the one you'll reach for most.
- **The more specific rule wins**: an id over a class, a class over a tag's name.
- **Colors come in pairs**: whenever you set a text color or a background, check the other still reads well against it.
- **`rem` for text, `px` for thin lines, `%` for room.**

---

## Mission: Visitor Card

Make the Visiting Hours stand out like a card at the station's door.

- Put the paragraph with the hours in the class `hours`. Give it a background of `#13294f`, text in `#ffd166`, the font `"Courier New", monospace` and a size of `1rem`.
- Put the paragraph with your jump links in the class `jumps`, centered, its text `0.875rem`.
- The heading **Visiting Hours** in `#ffd166`, like the biggest heading.

The rest of the page keeps the look it has.
