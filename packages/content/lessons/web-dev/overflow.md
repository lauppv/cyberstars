A box with a fixed width or a maximum height can get more content than fits: a long name in a narrow card, or ten lines of text in a box made for three. What happens to the rest is decided by `overflow`.

## The four answers

- `overflow: visible`, the normal one: the content spills out of the box, over whatever is next to it.
- `overflow: hidden`: whatever doesn't fit is cut off and can't be seen.
- `overflow: scroll`: the box always gets scrollbars.
- `overflow: auto`: the box gets scrollbars only when the content doesn't fit. Usually this is the one you want.

`overflow-x` and `overflow-y` set it for one direction: `overflow-y: auto` scrolls up and down only.

```css
.manifest {
  max-height: 10em;
  overflow-y: auto;
}
```

Sizes in `em` follow the box's own text size: `10em` is about six lines of its text, whatever the font size.

## Cutting a line with "..."

For one line of text that may be too long, like a name in a card, CSS can cut it and show `...`:

```css
.label {
  white-space: nowrap; /* never wrap to a second line */
  overflow: hidden; /* cut what doesn't fit */
  text-overflow: ellipsis; /* and show ... where it's cut */
}
```

You need all three: the text stays on one line, the rest is cut off, and the cut is marked with `...`.

Be careful when you hide content. What's cut off is still in the page, and a screen reader still reads it, but someone looking at the screen can't see it at all. Only cut what can be found somewhere else, like a name shown in full on its own page. Let longer text scroll.

---

## Mission: Bios

The crew cards get a few sentences about each person. Cards should stay the same neat size, whatever someone writes.

- Give every card a paragraph in the class `bio`, after the job, with a few sentences about the crew member.
- A bio never makes its card taller than about six lines of its text. A longer bio can still be read in full, inside its card.
- A crew member's name always stays on one line. If it's too long for the card, it's cut, and the cut is shown with `...`.
