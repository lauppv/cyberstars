On a poster, the most important words are thick and heavy, a quote is slanted, and a big title is sometimes in ALL CAPITALS. Same letters, same font, just written differently. CSS has a property for each of these.

## `font-weight`: thick or thin

```css
.highlight {
  font-weight: bold;
}

h2 {
  font-weight: normal;
}
```

`bold` makes letters thick, `normal` takes the thickness away. Headings are bold because the browser says so: `normal` undoes it.

You can also use numbers from `100` (very thin) to `900` (very thick): `400` is the same as `normal` and `700` is the same as `bold`. Many fonts only have those two.

## `font-style`: slanted

```css
.quote {
  font-style: italic;
}
```

`italic` slants the letters. `normal` straightens them again, for example an `<em>` you don't want slanted.

Remember: `<strong>` and `<em>` say what text **means**. These properties only change how it **looks**. A heading you'd like thinner stays a heading.

## `text-transform`: capitals

```css
h3 {
  text-transform: uppercase;
}
```

```text
CHESS        (typed in the HTML as "Chess")
```

`uppercase` shows every letter as a capital, `lowercase` as small letters, `capitalize` the first letter of every word. The text in your HTML doesn't change, only how it shows. That's better than typing in capitals: screen readers sometimes spell out words in capitals letter by letter.

## Break it on purpose

Write the value wrong:

```css
h3 {
  text-transform: upper;
}
```

`upper` isn't a value CSS knows, so the declaration is ignored and the heading stays as typed. The value is `uppercase`, in one word.

---

## Mission: Signs and labels

Make the shift headings look like small signs on a door, and the address like a handwritten note.

**Example**: MORNING SHIFT and NIGHT SHIFT show in capitals, not bold, and the address is slanted.

- The shift headings show in capital letters.
- The shift headings aren't bold.
- The address is in italic.

Psst, keep the shift headings typed normally in the HTML: CSS turns them into capitals :)
