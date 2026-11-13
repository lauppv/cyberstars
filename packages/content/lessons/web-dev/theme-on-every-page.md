You switch your phone to dark mode once, and every app you open after that is dark, from its very first screen. Nobody wants to see a white flash first, then the dark look. A theme chosen on one page of a site should work the same way: on every page, from the first moment.

## A script for every page

You know how to share a script between pages: `menu.js` is loaded by every page. A theme needs the same, a small script that every page loads and that puts the saved theme's class on `<html>`.

## Before the page shows

`defer` waits until the whole page is read, and that's right for most scripts. But a script that sets the colors should run **before** the browser draws anything, or the visitor sees the page in the wrong colors for a moment, then the right ones: a flash.

A script in the `<head>` **without** `defer` runs at once, while the browser reads the head, before the body exists. It can't touch the body yet, but it doesn't need to: `<html>` is already there.

```html
<head>
  <meta charset="UTF-8" />
  <script src="look.js"></script>
  <link rel="stylesheet" href="style.css" />
</head>
```

```js
const choice = localStorage.getItem("look");
if (choice === "sunny") {
  document.querySelector("html").classList.add("sunny");
}
```

Keep a script like that small and fast: the page waits for it.

## Variables of its own

All the scripts of a page share their variables when they're written at the top level. If two scripts on the same page both have a `const page`, the second one stops with `SyntaxError: Identifier 'page' has already been declared`. A script that runs on every page can't know every other script's names. Wrapping its code in braces, `{ ... }`, keeps its variables inside the block, as you saw in the lesson on scope.

## The choice beats the device

A theme saved as `dark` must win over a device in light mode. So the site needs a `dark` class too, which gives back the dark colors and, like `light`, is stronger than the media query.

## Break it on purpose

Load the theme script with `defer`. The theme still comes, but only after the page is read: on a slow phone, the visitor sees the device's colors first, then a jump to the saved theme. Then forget the script on one page: that page alone ignores the choice, and the site feels broken there.

---

## Mission: The theme everywhere

A theme chosen on the settings page shows only there. The whole site should follow it, on every page, after a reload too.

**Example**: choose Light on the settings page: the settings page turns light at once. Open the home page, the crew, the commander's page: all light, from their first moment. Choose System: every page follows the device again.

- A new script, `theme.js`, is loaded in the `<head>` of every page, the commander's too, without `defer`, so it runs before the page shows. It reads the saved settings and, when their theme is `light` or `dark`, puts that class on `<html>`. Its variables don't clash with other scripts.
- The class `dark` gives the site its dark colors, and wins over a device in light mode, as `light` wins over a dark one.
- On the settings page, choosing a theme puts its class on `<html>` at once, and only that one. System, or forgetting the settings, leaves no theme class.

Psst, nothing saved gives `JSON.parse(null)`, which is `null` :)
