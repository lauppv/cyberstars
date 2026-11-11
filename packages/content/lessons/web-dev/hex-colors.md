140 names sound like a lot, but your screen can show over 16 million colors. What if you want the exact blue of your school's logo? It has no name. For that, CSS lets you write a color as a **code**.

## Mixing light

Every color on a screen is a mix of three lights: **red**, **green** and **blue**. Each pixel has a tiny red, green and blue lamp, and turns each one up or down. All three at full: white. All three off: black. Red and green at full, blue off: yellow.

A **hex color** gives the strength of each light as a two-character code:

```css
h2 {
  color: #1d4e89;
}
```

`#1d4e89` is read in pairs: `1d` for red, `4e` for green, `89` for blue. Each pair goes from `00` (off) to `ff` (full), counting with the digits `0` to `9` and then the letters `a` to `f`. Here the blue pair is the biggest, so it's a blue, and all three are fairly small, so it's a dark one.

A few to compare:

- `#000000`: all off, black;
- `#ffffff`: all full, white;
- `#ff0000`: only red at full;
- `#ffd166`: lots of red, a fair bit of green, a little blue: a warm gold.

You don't work these out by hand. Designers pick colors in a design app and send you the codes, and any "color picker" website shows you the code of a color you click.

## Three-character codes

When each pair is a doubled character, you can write one of each: `#ffffff` is `#fff`, `#ff0000` is `#f00`, `#336699` is `#369`.

## Break it on purpose

Forget the `#`:

```css
h2 {
  color: 1d4e89;
}
```

Without the `#`, the browser doesn't know it's a color code. It ignores the declaration and the heading keeps its old color. Write five characters, `#1d4e8`, and the same happens: a hex color has exactly 3 or 6.

---

## Mission: The designer's colors

A designer made the station's logo and sent you two of its colors as hex codes: a deep blue, `#1d4e89`, and a dark gold, `#7a4f01`.

**Example**: About the Station, Visiting Hours and Station Rules show in the logo's deep blue, and Welcome aboard in its dark gold. Today on Board keeps its own color.

- Every part heading except Today on Board is `#1d4e89`.
- The biggest heading is `#7a4f01`.

Psst, a hex color always starts with `#` :)
