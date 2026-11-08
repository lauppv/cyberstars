So far your script has only talked to the console. Now it reaches into the page: finds an element, reads its text, writes new text in.

## Finding an element

```js
const title = document.querySelector("h1");
```

`document.querySelector` takes a **CSS selector**, the same kind you write in `style.css`, and gives back the **first** element of the page that matches. Any selector works: `"h1"`, `".warning"`, `"#today"`, `"p.address"`.

For an id there's also a shortcut, without the `#`:

```js
const bayTitle = document.getElementById("loading");
```

When nothing matches, you get `null`, "nothing". Using `null` as if it were an element stops the script with an error you'll meet often:

```text
Cannot read properties of null (reading 'textContent')
```

When you see it, the selector found nothing: a typo, a missing `#`, or an element that isn't on the page.

## Reading and writing text

`textContent` is the text inside an element:

```js
console.log(title.textContent); // reads it
title.textContent = "Cargo Bay, closed"; // replaces it
```

Writing it replaces everything inside the element with the new text, and the page changes at once.

A common pattern: leave an element empty in the HTML, with an id, and let the script fill it:

```html
<p id="bay-status"></p>
```

```js
const bayStatus = document.querySelector("#bay-status");
bayStatus.textContent = "Doors open";
```

Your script runs with `defer`, so by the time it looks, the whole page is there.

---

## Mission: Live Status

- Under the paragraph with the jump links, add an empty paragraph with the id `status`.
- In `script.js`, read the text of your biggest heading and log it.
- Fill the status paragraph with that text followed by `: all systems normal`. On your page it reads `Welcome aboard: all systems normal`, and if the heading ever changes, the status follows it.
