Before you wrote a single line of CSS, your page already had some style: the `h1` was big and bold, the links were blue and underlined, the `<em>` was italic. Where did that come from?

From the browser itself. Every browser has its own small style sheet, a bit like a house that comes with white walls before you paint it. Your CSS is the paint on top.

## The browser's own styles

Here are a few things the browser does on its own:

- headings are **bold**, and the lower the level, the smaller;
- `<strong>` is bold and `<em>` is italic;
- links are **blue and underlined**, and purple once you've visited them;
- paragraphs and headings have some space above and below them.

None of it is in your files. It's just what the browser does when nobody says otherwise.

## Your rules win

When your CSS says something about a property, your value takes the place of the browser's. Links are underlined by the browser, so:

```css
a {
  text-decoration: none;
  color: darkgreen;
}
```

```text
Read about chess        (dark green, no underline)
```

The browser wanted blue and underlined. Your rule says dark green and no line, so that's what shows.

What your rule doesn't mention stays as the browser made it. This rule says nothing about bold, so a link inside a `<strong>` is still bold.

## Break it on purpose

Take away the underline **and** give the link the same color as the text around it:

```css
a {
  text-decoration: none;
  color: black;
}
```

```text
New to the game? Read about chess before you start.
```

Which part is the link? Nobody can tell. A link must always look different from the text around it, by its color or its line, so people know they can click it.

---

## Mission: Links of your own

Your page's links still wear the browser's blue and underline. Give them the station's own look.

**Example**: Jump to today, Visiting hours, the link about space stations and Write to the crew all show in your own color, with no line under them.

- Every link has no underline.
- Every link has a color of your own, not the browser's blue.
- Links still look different from the text around them.

Psst, `text-decoration: none` takes the line away :)
