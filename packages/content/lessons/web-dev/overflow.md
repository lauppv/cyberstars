A box with a fixed width or a maximum height can get more content than fits: a long name in a narrow card, a bio of ten lines in a box made for three. What happens to the rest is up to `overflow`.

## The four answers

- `overflow: visible`, the default: the content spills out of the box and runs over whatever is next to it.
- `overflow: hidden`: what doesn't fit is cut off and can't be seen.
- `overflow: scroll`: the box gets scrollbars, always.
- `overflow: auto`: the box gets scrollbars only when the content doesn't fit. Usually the one you want.

`overflow-x` and `overflow-y` set it for one direction: `overflow-y: auto` scrolls up and down only.

```css
.manifest {
  max-height: 10em;
  overflow-y: auto;
}
```

Sizes in `em` follow the box's own text: `10em` is about six lines of it, whatever the font size.

## Cutting a line with "..."

For one line of text that may be too long, like a name in a card, CSS can cut it and show `...`:

```css
.label {
  white-space: nowrap; /* never wrap to a second line */
  overflow: hidden; /* cut what doesn't fit */
  text-overflow: ellipsis; /* and show ... where it's cut */
}
```

All three are needed: the text stays on one line, the rest is cut, and the cut is marked.

Hide content with care. What's cut off is still in the page, and a screen reader still reads it, but a sighted visitor can't see it at all. Cut only what can be found elsewhere, like a name shown in full on its own page; for longer text, let it scroll.

---

## Mission: Bios

- Give every crew card a paragraph in the class `bio`, after the job, with a few sentences about the crew member.
- A bio is never taller than `6em`; a longer one scrolls up and down inside its card.
- A third-level heading always stays on one line: too long a name is cut with `...`.
