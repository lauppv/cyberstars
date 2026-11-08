HTML says what's on the page, and CSS says how it looks. The third language of the web, **JavaScript**, says what the page **does**: react to a click, count things, change its text while the visitor watches. It's a real programming language, with variables, loops and functions, and it runs right inside the browser.

## The script element

JavaScript goes in a file of its own, ending in `.js`. You link it from the page with a `script` element:

```html
<script src="script.js" defer></script>
```

Unlike `<img>` or `<link>`, `<script>` always needs its closing tag, even with nothing between.

## When it runs

The browser reads a page from top to bottom, and it runs a script as soon as it reaches it. A script in the `<head>` would run before the browser even gets to the `<body>`. None of your page exists yet, so a script that looks for a heading finds nothing, and stops with an error.

`defer` fixes that. It tells the browser: download this file now, but only run it once the whole page has been read. So the script goes in the `<head>`, where it's easy to find, and it still sees the whole page.

You'll also see scripts placed at the very end of the `<body>` instead. That works too, and it's how people did it before `defer` existed. Use `defer`.

## A first line

This lesson added an empty `script.js`. Here's a line of JavaScript:

```js
document.body.style.backgroundColor = "#202030";
```

`document` is the page, as JavaScript sees it. `document.body` is its `<body>`, and `style.backgroundColor` is that body's CSS `background-color`. The line sets it, like a CSS rule would, but from the script.

Notice the name: in CSS it's `background-color`, in JavaScript it's `backgroundColor`. A CSS property with dashes loses them in JavaScript, and each word after the first starts with a capital letter: `font-size` becomes `fontSize`, `border-top` becomes `borderTop`. The value is the same text you'd write in CSS, in quotes.

The next lessons explain each piece. For now, notice that this line needs the `<body>` to exist when it runs.

---

## Mission: Power On

When the station powers on, a line lights up along the top of the home page.

- Link `script.js` from the `<head>` of your page, so it runs once the whole page has been read.
- In `script.js`, draw a line along the top of the page: at least 4 pixels thick, in a color of your choice. The script draws it, not your style sheet.

Then try the script **without** `defer` and look at the console under the preview: that's the error a script gets when it runs too early. Put `defer` back before you run the tests.
