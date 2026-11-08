HTML says what's on the page, CSS how it looks. The third language of the web, **JavaScript**, says what the page **does**: react to a click, count, change its text while the visitor watches. It's a real programming language, with variables, loops and functions, and it runs right in the browser.

## The script element

JavaScript goes in a file of its own, `.js`, linked from the page with a `script` element:

```html
<script src="script.js" defer></script>
```

Unlike `<img>` or `<link>`, `<script>` always has its closing tag, even with nothing between.

## When it runs

The browser reads a page from top to bottom and runs a script the moment it meets it. A script in the `<head>` would run before the browser has even reached the `<body>`: nothing of your page exists yet, and a script that looks for a heading finds nothing, then stops with an error.

`defer` fixes that. It tells the browser: fetch this file now, but run it only once the whole page has been read. So the script goes in the `<head>`, where it's easy to find, and still sees the whole page.

You'll also see scripts put at the very end of the `<body>` instead: that works too, and was the way before `defer`. Use `defer`.

## A first line

This lesson brought an empty `script.js`. Here's a line of JavaScript:

```js
document.body.style.borderTop = "4px solid hotpink";
```

`document` is the page as JavaScript sees it, `document.body` its `<body>`, and `style.borderTop` that body's CSS `border-top`. The line sets it, as a CSS rule would, but from the script. The next lessons take this apart piece by piece; for now, notice that it needs the `<body>` to exist when it runs.

---

## Mission: Power On

- Link `script.js` in the `<head>` of your page, so it runs once the page has been read.
- In `script.js`, give the page's body a top border of `6px solid #ffd166`, the way the line above does: a gold line along the top of the page.

Then try the script **without** `defer` and look at the console under the preview: that's the error a script gets when it runs too early. Put `defer` back before you run the tests.
