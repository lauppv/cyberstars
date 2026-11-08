Your crew page now has real boxes: framed, sized, centered, side by side, rounded and lifted. Use all of it on the last two pieces that still look plain.

Worth keeping in mind:

- **Content, padding, border, margin**, from the inside out. Padding takes the background; margin is always see-through.
- **`border-box`** makes `width` the whole box, so padding never makes it grow.
- **`margin: 0 auto`** centers a box narrower than its parent; `text-align: center` centers what's inside.
- **`inline-block`** for boxes in a row that wraps, **`none`** for gone.
- **`overflow: auto`** scrolls only when it must.
- **Four values go round from the top**: top, right, bottom, left, for padding, margin and corners alike.

---

## Mission: Duty Board Look

- Put the duty board's list in the class `duties`. Give it a background of `#13294f`, `16px` of padding on every side but the left, which gets `40px` so the numbers keep their room, a `4px solid #ffd166` border on its left side only, corners rounded `12px` on the right side only, a width of at most `600px`, and center it.
- Give the navigation a background of `#13294f`, corners rounded `12px`, and center its links.
