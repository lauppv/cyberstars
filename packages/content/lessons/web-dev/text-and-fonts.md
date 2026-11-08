Your page has its colors. Now its letters: which font, how heavy, how far apart.

## Fonts

`font-family` picks the font, as a list:

```css
body {
  font-family: Georgia, "Times New Roman", serif;
}
```

The browser takes the first font in the list the visitor's computer has. A font isn't sent with your page unless you send it, so a list is your plan B and C. The last name is a **generic family**, which every browser has a font for:

- `serif`, letters with little feet, like a printed book;
- `sans-serif`, letters without them, plain and clean on a screen;
- `monospace`, every letter as wide as the others, like code.

A name with spaces goes in quotes. Set the font on `body` and every element inside inherits it, unless a rule gives it another.

## Weight, style and spacing

```css
.label {
  font-weight: bold; /* or a number: 400 normal, 700 bold */
  font-style: italic;
  letter-spacing: 1px; /* room between letters */
  text-transform: uppercase; /* capitals on screen, whatever the HTML says */
}
p {
  line-height: 1.5; /* lines 1.5 times as tall as the letters */
}
```

`line-height` is the one that most changes how easy a page is to read: text with room between its lines tires the eyes less. Write it without a unit, a number that multiplies the font's size.

`text-transform: uppercase` changes only how the text looks. The HTML keeps its own letters, and a screen reader reads them as written.

## Lining up

`text-align` lines text up in its box: `left`, `right`, `center` or `justify`. Center a title, maybe a short line; a long paragraph centered is hard to read, since every line starts somewhere else.

`text-decoration` draws lines: links come underlined, `text-decoration: none` takes it away. Before you do that to a link, make sure it still looks like one, by its color at least, or visitors won't know it's there to click.

---

## Mission: Station Type

- The whole page in `Verdana, Geneva, sans-serif`, its lines `1.6` times as tall as the letters.
- The biggest heading centered.
- The section headings with `2px` between their letters.
- The shift headings in capitals, through CSS.
- Put the address paragraph in the class `address`, in italics.
