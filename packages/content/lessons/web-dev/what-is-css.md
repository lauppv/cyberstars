Your HTML says **what** is on the page. How it **looks** (the colors, the fonts, the spacing) is the job of a second language: **CSS**, short for Cascading Style Sheets.

## A rule

CSS is a list of **rules**. Each one picks some elements and says how they look:

```css
h2 {
  color: steelblue;
}
```

- `h2` is the **selector**: it says which elements the rule is for. A tag's name picks every element of that kind, so this rule colors every `h2` on the page.
- Between `{` and `}` come the **declarations**. Each one is a **property** and its **value**, with `:` between them and `;` at the end. `color` is the color of the text.

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

Use the third one. One file can style every page of your site. When the station gets a crew page and a schedule page, they'll look like the home page without copying a single line. Change a color in the file, and it changes everywhere. And your HTML stays about what's on the page.

`<link>` is an empty element, like `<meta>`, and it goes in the `<head>`. `rel="stylesheet"` says what kind of file it is, and `href` says where it is.

## The browser's own styles

Even before you write any CSS, a page already has styles: the browser's own. That's why `h1` is big and bold, and links are blue and underlined. Your rules go on top of them. When both say something about the same property, yours win.

This lesson brought a new file, `style.css`, empty for now.

---

## Mission: First Coat of Paint

Your page is still black on white, and every heading looks the same apart from its size. Give the station its colors:

- Link `style.css` to your page, and write every rule there, not in the HTML.
- Give each kind of heading a color of its own: the biggest heading one color, the section headings another, the shift headings a third. Every heading of the same kind gets the same color.
- The page stays white, so every color must still be easy to read on it.

CSS knows about 140 color names. A few to start with: `midnightblue`, `steelblue`, `slategray`, `darkgreen`, `firebrick`, `teal`, `indigo`.
