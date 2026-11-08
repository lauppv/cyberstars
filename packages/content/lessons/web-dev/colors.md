Color names like `steelblue` are handy, but there are only about 140 of them. CSS can name any of the 16 million colors a screen shows, in a few ways.

## Four ways to write a color

```css
h1 {
  color: #ffd166; /* hex */
}
h2 {
  color: rgb(255, 209, 102); /* red, green, blue */
}
h3 {
  color: hsl(42, 100%, 70%); /* hue, saturation, lightness */
}
```

All three are the same gold.

- **Hex**, `#ffd166`: a `#` and three pairs of digits, for red, green and blue, each from `00` to `ff` (0 to 255, counted in base 16). `#000000` is black, `#ffffff` white. It's what design tools hand you, so you'll see it most.
- **`rgb()`** says the same three amounts in ordinary numbers, 0 to 255.
- **`hsl()`** is the easiest to tweak by hand: the **hue** is an angle on the color wheel (0 red, 120 green, 240 blue), the **saturation** how vivid it is, and the **lightness** how light, from 0% black to 100% white. A lighter version of a color is the same `hsl()` with a higher lightness.

## See-through colors

Add a fourth amount, the **alpha**, from 0 (invisible) to 1 (solid), and the color lets what's behind it show through:

```css
.fragile {
  background-color: rgba(255, 140, 0, 0.25);
}
```

## Text and background

`color` is the color of the text; `background-color` the color behind it. Set the background on `body` and the whole page takes it: every element inherits the text color too, unless a rule of its own gives it another.

When you set one, check the other. Text that's hard to tell from its background is hard to read for everyone, and impossible for many: people with weak sight, a phone in the sun.

## Measuring contrast

How far apart two colors look is measured as a **contrast ratio**, from `1:1` (the same color) to `21:1` (black on white). The accessibility guidelines ask for at least **`4.5:1`** for ordinary text. Some pairs, for a feel of it:

| Text      | Background | Ratio |                                    |
| --------- | ---------- | ----- | ---------------------------------- |
| `#000000` | `#ffffff`  | 21:1  | as far as it goes                  |
| `#767676` | `#ffffff`  | 4.5:1 | just enough                        |
| `#999999` | `#ffffff`  | 2.8:1 | too faint                          |
| `#0000ee` | `#1a1a1a`  | 1.9:1 | the browser's links on a dark page |

You don't have to work it out by hand. In the browser's developer tools (right-click, **Inspect**), click a color square in the styles of an element: the picker shows the text's contrast ratio against its background, with a tick when it passes.

`hsl()` makes a good pair easy to aim for: keep the background's lightness low and the text's high, or the other way round. Two colors with a similar lightness hardly ever read well, whatever their hues.

A color you set on one element doesn't follow when you change the page around it. Turn the background dark, and every color that was picked for a white page, including the browser's own blue for links, has to be looked at again.

---

## Mission: Night Shift

At night the station dims its lights, and the crew reads the home page on the corridor screens. A white page glares in the dark.

- Turn the page dark: a dark background, with light text on it.
- Every text on the page must stay readable on it, at a contrast of at least 4.5:1: the headings, the paragraphs, the links, the small numbers below and above the line, the warnings. Some of them got their color for a white page; find them.
- The warnings keep standing out from the other paragraphs, and **Today on Board** from the other section headings.

The colors are yours: try them in `hsl()` first, it's the quickest way to find a pair that reads.
