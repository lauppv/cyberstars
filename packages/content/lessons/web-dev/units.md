When you print a school project, you pick a size for the title and the text: big for the title, smaller for the rest. On a screen, sizes are measured in a unit of their own: the **pixel**.

## Pixels

Look very closely at a screen and you'll see it's made of tiny dots of light. Each dot is a **pixel**. In CSS a pixel is written `px`: `16px` is 16 pixels.

You met pixels with the picture's `width` and `height`. In CSS you always write the `px` after the number.

## `font-size`

`font-size` sets how big the text is:

```css
p {
  font-size: 18px;
}

h1 {
  font-size: 40px;
}
```

The browser's normal text is `16px`. With this CSS, paragraphs are a bit bigger than normal, and the biggest heading is 40 pixels tall.

Headings already have sizes of their own, from the browser's styles: an `h1` is usually 32 pixels. `font-size` replaces that with your value.

Bigger isn't always better. Body text between 16 and 20 pixels reads well on most screens. Headings should be clearly bigger than the text, so the eye finds them first.

## Break it on purpose

Leave out the unit:

```css
p {
  font-size: 18;
}
```

`18` what? Pixels? Something else? CSS doesn't guess: the declaration is ignored and the paragraphs keep their size. A size always needs its unit. Only `0` can go without one, since 0 of anything is nothing.

---

## Mission: Sizes

Make the station's page easier to read and its title more striking.

**Example**: the biggest heading is clearly bigger than before, and the paragraphs a little bigger than the browser's normal text.

- The biggest heading is at least 40 pixels tall.
- Every paragraph's text is between 17 and 20 pixels.

Psst, every size needs its `px` :)
