Your page has its colors. Now for its letters: which font, how thick, how far apart.

## Fonts

`font-family` picks the font. You give it a list:

```css
body {
  font-family: Georgia, "Times New Roman", serif;
}
```

The browser uses the first font in the list that the visitor's computer has. A font isn't sent with your page unless you send it, so the list is your plan B and plan C. The last name is a **generic family**. Every browser has a font for it:

- `serif`: letters with little feet, like in a printed book;
- `sans-serif`: letters without feet, plain and clear on a screen;
- `monospace`: every letter equally wide, like code.

A font name with spaces goes in quotes. Set the font on `body`, and every element inside gets it too, unless a rule gives it another one.

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

`line-height` changes more than anything else how easy a page is to read: text with space between its lines is less tiring for the eyes. Write it as a plain number, without a unit. The number is multiplied by the font's size.

`text-transform: uppercase` only changes how the text looks. The HTML keeps its own letters, and a screen reader reads them as they are written.

## Lining up

`text-align` lines up text inside its box: `left`, `right`, `center` or `justify`. Center a title, or maybe a short line. A long centered paragraph is hard to read, because every line starts in a different place.

`text-decoration` draws lines on text. Links are underlined by default, and `text-decoration: none` removes the line. Before you do that to a link, make sure it still looks like a link, at least by its color. Otherwise visitors won't know they can click it.

---

## Mission: Station Type

The corridor screens are far from where the crew walks. Make your page easy to read from a distance:

- The whole page in a plain font without little feet. Not every computer has the same fonts, so give a list that always ends in a font every browser has.
- Room between the lines of the text: lines at least 1.4 times as tall as the letters.
- The biggest heading in the middle of the page.
- The section headings with their letters spread a little apart.
- The shift headings in capital letters, without retyping them.
- The address in italics. Put its paragraph in the class `address`: later lessons use it.
