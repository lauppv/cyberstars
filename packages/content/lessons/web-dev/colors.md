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

`color` is the color of the text; `background-color` the color behind it. Set the background on `body` and the whole page takes it.

When you set one, check the other. Text that's hard to tell from its background is hard to read for everyone, and impossible for many: people with weak sight, a phone in the sun. Dark text on a light background, or light on dark, keeps a strong **contrast**. Gray on gray doesn't.

Links have the browser's blue, made for a white page. On a dark one, give them a color of their own.

---

## Mission: Night Shift Colors

The station runs on night lighting. Turn your page dark, keeping everything readable:

- the page's background `#0b1d3a`, and its text `#f0f4ff`;
- the biggest heading `#ffd166`;
- the section headings `hsl(210, 70%, 75%)`, and **Today on Board** `#7bd389`;
- the shift headings `rgb(200, 210, 230)`;
- the warnings: their text `#ffb3b3`, on a background of `rgba(255, 80, 80, 0.2)`;
- links `#8ecbff`.

Keep teal for the text below and above the line.
