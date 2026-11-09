Think about the clothes you wear. You're the same person in a school uniform or in a football kit, only the look changes. A web page is the same: the HTML says **what** is on it, and a second language decides how it **looks**: the colors, the fonts, the spacing.

That language is **CSS**. Your station's page is still plain black on white. Time to dress it up.

## A first rule

CSS is written as **rules**. Here is one:

```css
h1 {
  color: steelblue;
}
```

It says: "every `h1` on the page has steel-blue text". Put it in action and the page's biggest heading turns blue. The rest of the page doesn't change.

`steelblue` is one of the color names CSS knows. A few others: `red`, `green`, `teal`, `indigo`, `firebrick`. We'll look at colors properly in a later lesson. For now, any of these will do.

## A file of its own

Your HTML and your CSS live in separate files. Look at the files of your site: there's a new one, `style.css`, empty for now. That's where your CSS goes.

The page needs to know about the file. You tell it with a `<link>` in the `<head>`:

```html
<head>
  <meta charset="UTF-8" />
  <title>Game Club</title>
  <link rel="stylesheet" href="style.css" />
</head>
```

- `rel="stylesheet"` says what kind of file it is: a style sheet, a file of CSS;
- `href` says where it is, like a link's.

Like `<meta>`, `<link>` has no closing tag.

Why a separate file? Later your site gets more pages. They can all link the same `style.css`, so they all look alike, and when you change a color in that one file, it changes on every page at once.

## Break it on purpose

Write the rule in `style.css` but leave out the `<link>`. Nothing changes on the page: the browser never opens a file nobody linked.

Now put the `<link>` back, but name the file wrong:

```html
<link rel="stylesheet" href="styles.css" />
```

Again nothing happens, and the browser doesn't show you any error. When your CSS seems to do nothing at all, check the link first.

---

## Mission: A first coat of paint

Your `index.html` is ready, and your site has an empty `style.css`.

**Example**: the page looks as before, except the biggest heading is in a color, like steel blue or teal.

- `style.css` is linked from the `<head>` of `index.html`.
- In `style.css`, a rule gives the biggest heading a color of your own.

Psst, the CSS goes in `style.css`, not in `index.html` :)
