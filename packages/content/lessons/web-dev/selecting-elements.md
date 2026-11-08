So far your script has only talked to the console. Now it reaches into the page: it finds an element, reads its text and writes new text in it.

## Finding an element

```js
const title = document.querySelector("h1");
```

`document.querySelector` takes a **CSS selector**, the same kind you write in `style.css`. It gives you back the **first** element of the page that matches. Any selector works: `"h1"`, `".warning"`, `"#today"`, `"p.address"`.

For an id there's also a shortcut, written without the `#`:

```js
const bayTitle = document.getElementById("loading");
```

When nothing matches, you get `null`, which means "nothing". If you use `null` as if it were an element, the script stops with an error you'll see often:

```text
Cannot read properties of null (reading 'textContent')
```

When you see it, your selector found nothing. Maybe there's a typo, a missing `#`, or the element isn't on the page.

## Reading and writing text

`textContent` is the text inside an element:

```js
console.log(title.textContent); // reads it
title.textContent = "Cargo Bay, closed"; // replaces it
```

Writing it replaces everything inside the element with the new text, and the page changes right away.

A common trick: leave an element empty in the HTML, give it an id, and let the script fill it:

```html
<p id="bay-status"></p>
```

```js
const bayStatus = document.querySelector("#bay-status");
bayStatus.textContent = "Doors open";
```

Your script runs with `defer`, so when it looks, the whole page is already there.

---

## Mission: Live Status

The home page needs a status line that the script keeps up to date.

- Right under the paragraph with your jump links, add an empty paragraph with the id `status`.
- The status says the page's biggest heading followed by `: all systems normal`. On your page that's `Welcome aboard: all systems normal`. The heading may be renamed one day, and the status must follow it without changing the script.
- To check what your script found, log the heading's text in the console too.
