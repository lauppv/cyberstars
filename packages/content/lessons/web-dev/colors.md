Color names like `steelblue` are handy, but there are only about 140 of them. A screen can show 16 million colors, and CSS can name any of them, in a few ways.

## Ways to write a color

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

- **Hex**, `#ffd166`: a `#` and three pairs of digits, for red, green and blue. Each pair goes from `00` to `ff`, which means 0 to 255 counted in base 16. `#000000` is black and `#ffffff` is white. Design tools give you colors like this, so you'll see hex most often.
- **`rgb()`** says the same three amounts in normal numbers, from 0 to 255.
- **`hsl()`** is the easiest to change by hand. The **hue** is the color's place on the color wheel, as an angle (0 red, 120 green, 240 blue). The **saturation** is how strong the color is. The **lightness** is how light it is, from 0% (black) to 100% (white). To get a lighter version of a color, keep the same `hsl()` and raise the lightness.

## See-through colors

Add a fourth number, the **alpha**, from 0 (invisible) to 1 (solid), and you can see through the color:

```css
.fragile {
  background-color: rgba(255, 140, 0, 0.25);
}
```

## Text and background

`color` is the color of the text, and `background-color` is the color behind it. Set the background on `body`, and the whole page gets it. The text color you set on `body` also passes down to every element inside it, unless a rule gives an element its own color.

When you set one, check the other. Text that looks too much like its background is hard to read for everyone, and impossible for some people: someone with weak eyes, or anyone reading a phone in the sun.

## Measuring contrast

How different two colors look is measured as a **contrast ratio**. It goes from `1:1` (the same color) to `21:1` (black on white). The accessibility guidelines ask for at least **`4.5:1`** for normal text. Big, bold text, like a heading, is easier to read, so for it **`3:1`** is enough. Some pairs, to get a feel for it:

| Text      | Background | Ratio |                                    |
| --------- | ---------- | ----- | ---------------------------------- |
| `#000000` | `#ffffff`  | 21:1  | as far as it goes                  |
| `#767676` | `#ffffff`  | 4.5:1 | just enough                        |
| `#999999` | `#ffffff`  | 2.8:1 | too faint                          |
| `#0000ee` | `#1a1a1a`  | 1.9:1 | the browser's links on a dark page |

You don't have to work it out yourself. Right-click an element and pick **Inspect** to open the browser's developer tools. Click a little color square in the element's styles: the color picker shows the contrast ratio of the text on its background, with a tick when it's good enough.

`hsl()` makes it easy to find a good pair: give the background a low lightness and the text a high one, or the other way round. Two colors with almost the same lightness are almost never easy to read, whatever their hues.

A color you gave one element doesn't change when the page around it does. Make the background dark, and every color you picked for a white page, including the browser's own blue for links, has to be checked again.

---

## Mission: Night Shift

At night the station dims its lights, and the crew reads the home page on the screens in the corridors. A white page is far too bright in the dark.

- Make the page dark: a dark background with light text.
- Every text on the page must still be easy to read: a contrast of at least 4.5:1, or 3:1 for the headings. That means the paragraphs, the headings, the links, the small numbers below and above the line, and the warnings. Some of them got their colors for a white page. Find them.
- The warnings should still stand out from the other paragraphs, and **Today on Board** from the other section headings.

The colors are up to you. Try them in `hsl()` first: it's the quickest way to find a pair that's easy to read.
