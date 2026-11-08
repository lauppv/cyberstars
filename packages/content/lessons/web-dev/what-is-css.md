Your HTML says **what** is on the page. How it **looks**, the colors, the fonts, the spacing, is the job of a second language: **CSS**, Cascading Style Sheets.

## A rule

CSS is a list of **rules**. Each one picks some elements and says how they look:

```css
h2 {
  color: steelblue;
}
```

- `h2` is the **selector**: which elements the rule is for. A tag's name picks every element of that kind, so this rule colors every `h2` of the page.
- Between `{` and `}` come the **declarations**, each a **property** and its **value**, with `:` between them and `;` at the end. `color` is the color of the text.

A rule can hold many declarations, and a style sheet many rules. Comments in CSS are written `/* like this */`.

## Where CSS goes

There are three places to write it:

```html
<!-- 1. On the element itself, in a style attribute -->
<h2 style="color: steelblue">Crates</h2>

<!-- 2. In a <style> element in the head -->
<style>
  h2 {
    color: steelblue;
  }
</style>

<!-- 3. In a file of its own, linked from the head -->
<link rel="stylesheet" href="style.css" />
```

The third is the one to use. One file can style every page of your site, so when the station gets a crew page and a schedule page, they'll look like the home page without a line copied. Change a color in the file and it changes everywhere. And your HTML stays about what's on the page.

`<link>` is an empty element, like `<meta>`, and it goes in the `<head>`. `rel="stylesheet"` says what the file is, `href` where it is.

## The browser's own styles

Even before you write any CSS, a page has styles: the browser's. That's why `h1` is big and bold and links are blue and underlined. Your rules go on top of them, and where both say something about the same property, yours win.

This lesson brought a new file, `style.css`, empty for now.

---

## Mission: First Coat of Paint

- Link `style.css` to your page.
- In `style.css`, make the text of every biggest heading `midnightblue`, of every section heading `steelblue` and of every shift heading `slategray`. These are color names CSS knows.

Write the rules in `style.css`, not in the HTML.
